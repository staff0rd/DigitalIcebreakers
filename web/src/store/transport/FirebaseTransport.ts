import { Auth, signInAnonymously } from "firebase/auth";
import {
  Database,
  get,
  onChildAdded,
  onDisconnect,
  onValue,
  push,
  ref,
  remove,
  serverTimestamp,
  set,
  update,
} from "firebase/database";
import { Player } from "../../Player";
import { ReconnectPayload } from "../connection/types";
import { UserState } from "../user/types";
import { getFirebaseClient } from "./firebaseClient";
import {
  Transport,
  TransportEvent,
  TransportEventHandlers,
} from "./Transport";

const CODE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const CODE_LENGTH = 4;
const MAX_CODE_ATTEMPTS = 50;

const randomCode = () =>
  Array.from(
    { length: CODE_LENGTH },
    () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]
  ).join("");

type PlayerRecord = {
  id: string;
  name: string;
  isRegistered: boolean;
  isPresenter: boolean;
  connected: boolean;
  uid: string;
};

type LobbyRecord = {
  name: string;
  presenterId: string;
  currentGame?: { name: string } | null;
  players?: Record<string, PlayerRecord>;
};

type AttachedLobby = {
  code: string;
  player: PlayerRecord;
  unsubscribes: (() => void)[];
};

const visiblePlayers = (
  players: Record<string, PlayerRecord> | undefined | null,
  presenterId: string
): Player[] =>
  Object.values(players ?? {})
    .filter((p) => p.isRegistered && p.connected && p.id !== presenterId)
    .map((p) => ({ id: p.id, name: p.name }));

export class FirebaseTransport implements Transport {
  private db: Database;
  private auth: Auth;
  private handlers = new Map<TransportEvent, (payload?: never) => void>();
  private startPromise?: Promise<void>;
  private uid = "";
  private generateCode: () => string;
  private attached?: AttachedLobby;

  constructor(options: { generateCode?: () => string } = {}) {
    const { db, auth } = getFirebaseClient();
    this.db = db;
    this.auth = auth;
    this.generateCode = options.generateCode ?? randomCode;
  }

  start(): Promise<void> {
    if (!this.startPromise) {
      this.startPromise = signInAnonymously(this.auth)
        .then((credential) => {
          this.uid = credential.user.uid;
        })
        .catch((err) => {
          this.startPromise = undefined;
          throw err;
        });
    }
    return this.startPromise;
  }

  async connect(user: UserState, lobbyId?: string): Promise<void> {
    await this.start();
    const indexRef = ref(this.db, `playerLobbies/${user.id}`);
    const storedCode = (await get(indexRef)).val() as string | null;
    const code = (lobbyId ?? storedCode ?? "").toUpperCase();
    if (!code) {
      this.emit("connected");
      return;
    }
    const lobbySnapshot = await get(ref(this.db, `lobbies/${code}`));
    const lobby = lobbySnapshot.val() as LobbyRecord | null;
    const player = lobby?.players?.[user.id];
    if (!lobby || !player) {
      await remove(indexRef);
      this.emit("connected");
      return;
    }
    this.attach(code, lobby, player);
  }

  async createLobby(name: string, user: UserState): Promise<void> {
    await this.start();
    await this.closeOwnLobby(user);
    const code = await this.uniqueCode();
    const player: PlayerRecord = {
      id: user.id,
      name: user.name || "",
      isRegistered: true,
      isPresenter: true,
      connected: true,
      uid: this.uid,
    };
    const lobby: LobbyRecord = {
      name,
      presenterId: user.id,
      currentGame: null,
      players: { [user.id]: player },
    };
    await set(ref(this.db, `lobbies/${code}`), {
      ...lobby,
      createdAt: serverTimestamp(),
      presenterUid: this.uid,
    });
    await set(ref(this.db, `playerLobbies/${user.id}`), code);
    this.attach(code, lobby, player);
  }

  async connectToLobby(user: UserState, lobbyId: string): Promise<void> {
    await this.start();
    const code = lobbyId.toUpperCase();
    const lobbySnapshot = await get(ref(this.db, `lobbies/${code}`));
    const lobby = lobbySnapshot.val() as LobbyRecord | null;
    if (!lobby) {
      this.emit("closelobby");
      return;
    }
    if (this.attached && this.attached.code !== code) {
      await this.leaveLobby();
    }
    const player: PlayerRecord = {
      id: user.id,
      name: user.name || "",
      isRegistered: !!user.isRegistered,
      isPresenter: lobby.presenterId === user.id,
      connected: true,
      uid: this.uid,
    };
    await update(
      ref(this.db, `lobbies/${code}/players/${user.id}`),
      player as unknown as Record<string, unknown>
    );
    await set(ref(this.db, `playerLobbies/${user.id}`), code);
    lobby.players = { ...lobby.players, [user.id]: player };
    this.attach(code, lobby, player);
  }

  async closeLobby(): Promise<void> {
    if (!this.attached) return;
    await remove(ref(this.db, `lobbies/${this.attached.code}`));
  }

  async newGame(name: string): Promise<void> {
    if (!this.attached) return;
    await update(ref(this.db, `lobbies/${this.attached.code}`), {
      currentGame: { name, startedAt: serverTimestamp() },
      messages: null,
    });
  }

  async sendPresenterMessage(message: unknown): Promise<void> {
    if (!this.attached) return;
    await push(
      ref(this.db, `lobbies/${this.attached.code}/messages/toPlayers`),
      { json: JSON.stringify(message ?? null) }
    );
  }

  async sendClientMessage(message: unknown): Promise<void> {
    if (!this.attached) return;
    await push(
      ref(this.db, `lobbies/${this.attached.code}/messages/toPresenter`),
      {
        json: JSON.stringify(message ?? null),
        senderId: this.attached.player.id,
        senderName: this.attached.player.name,
      }
    );
  }

  on<E extends TransportEvent>(
    event: E,
    handler: TransportEventHandlers[E]
  ): void {
    this.handlers.set(event, handler);
  }

  off(event: TransportEvent): void {
    this.handlers.delete(event);
  }

  private emit<E extends TransportEvent>(
    event: E,
    payload?: Parameters<TransportEventHandlers[E]>[0]
  ): void {
    this.handlers.get(event)?.(payload as never);
  }

  private async closeOwnLobby(user: UserState): Promise<void> {
    const storedCode = (
      await get(ref(this.db, `playerLobbies/${user.id}`))
    ).val() as string | null;
    if (!storedCode) return;
    const lobby = (
      await get(ref(this.db, `lobbies/${storedCode}`))
    ).val() as LobbyRecord | null;
    if (lobby?.presenterId === user.id) {
      await remove(ref(this.db, `lobbies/${storedCode}`));
    }
  }

  private async uniqueCode(): Promise<string> {
    for (let attempt = 0; attempt < MAX_CODE_ATTEMPTS; attempt++) {
      const code = this.generateCode().toUpperCase();
      if (code.length !== CODE_LENGTH) continue;
      const existing = await get(ref(this.db, `lobbies/${code}`));
      if (!existing.exists()) {
        return code;
      }
    }
    throw new Error("Could not generate a unique lobby code");
  }

  private attach(code: string, lobby: LobbyRecord, player: PlayerRecord) {
    this.detach();
    const unsubscribes: (() => void)[] = [];
    this.attached = { code, player, unsubscribes };

    this.emit("reconnect", {
      playerId: player.id,
      playerName: player.name,
      lobbyId: code,
      lobbyName: lobby.name,
      isPresenter: player.isPresenter,
      players: visiblePlayers(lobby.players, lobby.presenterId),
      currentGame: lobby.currentGame?.name ?? "",
      isRegistered: player.isRegistered,
    } satisfies ReconnectPayload);

    const connectedRef = ref(
      this.db,
      `lobbies/${code}/players/${player.id}/connected`
    );
    unsubscribes.push(
      onValue(ref(this.db, ".info/connected"), (snapshot) => {
        if (snapshot.val()) {
          // Re-arm presence after every (re)connection; onDisconnect ops are
          // consumed by the server when the connection drops.
          onDisconnect(connectedRef).set(false);
          set(connectedRef, true);
        }
      })
    );

    unsubscribes.push(
      onValue(ref(this.db, `lobbies/${code}/players`), (snapshot) => {
        this.emit(
          "players",
          visiblePlayers(
            snapshot.val() as Record<string, PlayerRecord> | null,
            lobby.presenterId
          )
        );
      })
    );

    let initialGame = true;
    unsubscribes.push(
      onValue(ref(this.db, `lobbies/${code}/currentGame`), (snapshot) => {
        if (initialGame) {
          initialGame = false;
          return;
        }
        const game = snapshot.val() as { name: string } | null;
        if (game?.name) {
          this.emit("newgame", game.name);
        }
      })
    );

    unsubscribes.push(
      onValue(ref(this.db, `lobbies/${code}`), (snapshot) => {
        if (!snapshot.exists()) {
          this.detach();
          remove(ref(this.db, `playerLobbies/${player.id}`));
          this.emit("closelobby");
        }
      })
    );

    const messagesPath = player.isPresenter
      ? `lobbies/${code}/messages/toPresenter`
      : `lobbies/${code}/messages/toPlayers`;
    unsubscribes.push(
      onChildAdded(ref(this.db, messagesPath), (snapshot) => {
        const message = snapshot.val() as {
          json: string;
          senderId?: string;
          senderName?: string;
        };
        const payload = JSON.parse(message.json);
        if (player.isPresenter) {
          this.emit("gameMessage", {
            payload,
            id: message.senderId,
            name: message.senderName,
          });
        } else {
          this.emit("gameMessage", payload);
        }
      })
    );
  }

  private async leaveLobby(): Promise<void> {
    if (!this.attached) return;
    const { code, player } = this.attached;
    this.detach();
    await onDisconnect(
      ref(this.db, `lobbies/${code}/players/${player.id}/connected`)
    ).cancel();
    await remove(ref(this.db, `lobbies/${code}/players/${player.id}`));
    await remove(ref(this.db, `playerLobbies/${player.id}`));
  }

  private detach() {
    const unsubscribes = this.attached?.unsubscribes ?? [];
    this.attached = undefined;
    unsubscribes.forEach((unsubscribe) => unsubscribe());
  }
}
