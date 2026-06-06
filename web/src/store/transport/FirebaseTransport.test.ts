import { describe, it, expect, beforeEach, vi } from "vitest";
import { FirebaseTransport } from "./FirebaseTransport";
import { resetFakeFirebase, simulateClientDisconnect } from "./fakeFirebase";
import { ReconnectPayload } from "../connection/types";
import { Player } from "../../Player";
import { UserState } from "../user/types";

vi.mock("firebase/database", async () =>
  (await import("./fakeFirebase")).fakeDatabaseModule
);
vi.mock("firebase/auth", async () =>
  (await import("./fakeFirebase")).fakeAuthModule
);
vi.mock("./firebaseClient", async () =>
  (await import("./fakeFirebase")).fakeFirebaseClientModule
);

type RecordedEvents = {
  reconnect: ReconnectPayload[];
  players: Player[][];
  newgame: string[];
  gameMessage: unknown[];
  closelobby: number;
  connected: number;
};

const createClient = (codes?: string[]) => {
  const transport = new FirebaseTransport(
    codes ? { generateCode: () => codes.shift() ?? "" } : {}
  );
  const events: RecordedEvents = {
    reconnect: [],
    players: [],
    newgame: [],
    gameMessage: [],
    closelobby: 0,
    connected: 0,
  };
  transport.on("reconnect", (payload) => events.reconnect.push(payload));
  transport.on("players", (players) => events.players.push(players));
  transport.on("newgame", (name) => events.newgame.push(name));
  transport.on("gameMessage", (message) => events.gameMessage.push(message));
  transport.on("closelobby", () => events.closelobby++);
  transport.on("connected", () => events.connected++);
  return { transport, events };
};

let userCounter = 0;

const createUser = (overrides: Partial<UserState> = {}): UserState => ({
  id: `user-${++userCounter}`,
  name: "Alice",
  isRegistered: true,
  ...overrides,
});

const createLobby = async (codes: string[] = ["AAAA"]) => {
  const presenter = createClient(codes);
  const presenterUser = createUser({ id: "presenter-1", name: "Presenter" });
  await presenter.transport.start();
  await presenter.transport.createLobby("My Lobby", presenterUser);
  const code = presenter.events.reconnect[0].lobbyId;
  return { presenter, presenterUser, code };
};

const joinAsPlayer = async (
  code: string,
  overrides: Partial<UserState> = {}
) => {
  const player = createClient();
  const user = createUser(overrides);
  await player.transport.start();
  await player.transport.connectToLobby(user, code);
  return { player, user };
};

describe("firebase transport", () => {
  beforeEach(() => {
    resetFakeFirebase();
    userCounter = 0;
  });

  describe("creating a lobby", () => {
    it("confirms the lobby to the presenter", async () => {
      const { presenter, presenterUser } = await createLobby();
      expect(presenter.events.reconnect).toHaveLength(1);
      expect(presenter.events.reconnect[0]).toMatchObject({
        lobbyName: "My Lobby",
        isPresenter: true,
        isRegistered: true,
        playerId: presenterUser.id,
        players: [],
      });
      expect(presenter.events.reconnect[0].lobbyId).toMatch(/^[A-Z0-9]{4}$/);
    });

    describe("when the generated code is already taken", () => {
      it("generates another code", async () => {
        await createLobby(["AAAA"]);
        const second = createClient(["AAAA", "BBBB"]);
        await second.transport.start();
        await second.transport.createLobby(
          "Other Lobby",
          createUser({ id: "presenter-2" })
        );
        expect(second.events.reconnect[0].lobbyId).toBe("BBBB");
      });
    });

    describe("when the presenter already has a lobby", () => {
      it("closes the old lobby", async () => {
        const { presenter, presenterUser, code } = await createLobby([
          "AAAA",
          "CCCC",
        ]);
        const { player } = await joinAsPlayer(code);
        await presenter.transport.createLobby("Second Lobby", presenterUser);
        expect(player.events.closelobby).toBe(1);
      });
    });
  });

  describe("joining a lobby", () => {
    it("confirms the lobby to the player", async () => {
      const { code } = await createLobby();
      const { player, user } = await joinAsPlayer(code);
      expect(player.events.reconnect[0]).toMatchObject({
        lobbyId: code,
        lobbyName: "My Lobby",
        isPresenter: false,
        isRegistered: true,
        playerId: user.id,
        playerName: user.name,
      });
    });

    it("matches the join code case insensitively", async () => {
      const { code } = await createLobby(["WXYZ"]);
      const { player } = await joinAsPlayer(code.toLowerCase());
      expect(player.events.reconnect[0].lobbyId).toBe("WXYZ");
    });

    it("shows the player to the presenter", async () => {
      const { presenter, code } = await createLobby();
      const { user } = await joinAsPlayer(code, { name: "Alice" });
      const lastPlayers =
        presenter.events.players[presenter.events.players.length - 1];
      expect(lastPlayers).toEqual([{ id: user.id, name: "Alice" }]);
    });

    describe("when the player has not registered a name", () => {
      it("does not show them to the presenter", async () => {
        const { presenter, code } = await createLobby();
        await joinAsPlayer(code, { isRegistered: false, name: "" });
        const lastPlayers =
          presenter.events.players[presenter.events.players.length - 1];
        expect(lastPlayers).toEqual([]);
      });
    });

    describe("when the lobby does not exist", () => {
      it("tells the player the lobby is closed", async () => {
        const player = createClient();
        await player.transport.start();
        await player.transport.connectToLobby(createUser(), "ZZZZ");
        expect(player.events.closelobby).toBe(1);
        expect(player.events.reconnect).toHaveLength(0);
      });
    });
  });

  describe("starting a game", () => {
    it("tells everyone in the lobby", async () => {
      const { presenter, code } = await createLobby();
      const { player } = await joinAsPlayer(code);
      await presenter.transport.newGame("buzzer");
      expect(presenter.events.newgame).toEqual(["buzzer"]);
      expect(player.events.newgame).toEqual(["buzzer"]);
    });

    it("announces the same game again when restarted", async () => {
      const { presenter, code } = await createLobby();
      const { player } = await joinAsPlayer(code);
      await presenter.transport.newGame("buzzer");
      await presenter.transport.newGame("buzzer");
      expect(player.events.newgame).toEqual(["buzzer", "buzzer"]);
    });
  });

  describe("playing a game", () => {
    it("delivers client messages to the presenter with the sender identity", async () => {
      const { presenter, code } = await createLobby();
      const { player, user } = await joinAsPlayer(code, { name: "Alice" });
      await presenter.transport.newGame("buzzer");
      await player.transport.sendClientMessage("down");
      expect(presenter.events.gameMessage).toEqual([
        { payload: "down", id: user.id, name: "Alice" },
      ]);
    });

    it("does not deliver client messages to other players", async () => {
      const { code } = await createLobby();
      const { player } = await joinAsPlayer(code);
      const { player: other } = await joinAsPlayer(code);
      await player.transport.sendClientMessage("down");
      expect(other.events.gameMessage).toEqual([]);
    });

    it("delivers presenter messages to players", async () => {
      const { presenter, code } = await createLobby();
      const { player } = await joinAsPlayer(code);
      await presenter.transport.newGame("broadcast");
      await presenter.transport.sendPresenterMessage("hello audience");
      expect(player.events.gameMessage).toEqual(["hello audience"]);
    });
  });

  describe("closing the lobby", () => {
    it("tells everyone the lobby is closed", async () => {
      const { presenter, code } = await createLobby();
      const { player } = await joinAsPlayer(code);
      await presenter.transport.closeLobby();
      expect(presenter.events.closelobby).toBe(1);
      expect(player.events.closelobby).toBe(1);
    });
  });

  describe("presence", () => {
    it("removes a player from the lobby when their connection drops", async () => {
      const { presenter, code } = await createLobby();
      const { user } = await joinAsPlayer(code, { name: "Alice" });
      simulateClientDisconnect(user.id);
      const lastPlayers =
        presenter.events.players[presenter.events.players.length - 1];
      expect(lastPlayers).toEqual([]);
    });
  });

  describe("reconnecting", () => {
    it("returns a player to their lobby after a refresh", async () => {
      const { presenter, code } = await createLobby();
      const { user } = await joinAsPlayer(code, { name: "Alice" });
      await presenter.transport.newGame("buzzer");

      const refreshed = createClient();
      await refreshed.transport.start();
      await refreshed.transport.connect({
        id: user.id,
        name: "",
        isRegistered: false,
      });
      expect(refreshed.events.reconnect[0]).toMatchObject({
        lobbyId: code,
        playerName: "Alice",
        isRegistered: true,
        currentGame: "buzzer",
      });
    });

    it("restores the lobby for a refreshed presenter", async () => {
      const { presenterUser, code } = await createLobby();
      await joinAsPlayer(code, { name: "Alice" });

      const refreshed = createClient();
      await refreshed.transport.start();
      await refreshed.transport.connect({
        id: presenterUser.id,
        name: "",
        isRegistered: false,
      });
      expect(refreshed.events.reconnect[0]).toMatchObject({
        lobbyId: code,
        isPresenter: true,
      });
    });

    describe("when the user has no lobby", () => {
      it("reports the connection without a lobby", async () => {
        const client = createClient();
        await client.transport.start();
        await client.transport.connect(createUser());
        expect(client.events.connected).toBe(1);
        expect(client.events.reconnect).toHaveLength(0);
      });
    });

    describe("when the user's lobby has closed", () => {
      it("reports the connection without a lobby", async () => {
        const { presenter, code } = await createLobby();
        const { user } = await joinAsPlayer(code);
        await presenter.transport.closeLobby();

        const refreshed = createClient();
        await refreshed.transport.start();
        await refreshed.transport.connect(user);
        expect(refreshed.events.connected).toBe(1);
        expect(refreshed.events.reconnect).toHaveLength(0);
      });
    });
  });
});
