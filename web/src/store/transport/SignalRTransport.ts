import { HubConnection } from "@microsoft/signalr";
import {
  Transport,
  TransportEvent,
  TransportEventHandlers,
} from "./Transport";
import { UserState } from "../user/types";

const hubEvents = [
  "reconnect",
  "joined",
  "left",
  "players",
  "closelobby",
  "connected",
  "newgame",
  "gameMessage",
] as const;

export class SignalRTransport implements Transport {
  private connection: HubConnection;
  private handlers = new Map<TransportEvent, (payload?: never) => void>();

  constructor(connectionFactory: () => HubConnection) {
    this.connection = connectionFactory();
    hubEvents.forEach((event) => {
      this.connection.on(event, (payload?: unknown) => {
        this.handlers.get(event)?.(payload as never);
      });
    });
    this.connection.onclose(() => {
      this.handlers.get("connectionclosed")?.(undefined as never);
    });
  }

  start(): Promise<void> {
    return this.connection.start();
  }

  connect(user: UserState, lobbyId?: string): Promise<void> {
    return this.connection.invoke("connect", user, lobbyId);
  }

  createLobby(name: string, user: UserState): Promise<void> {
    return this.connection.invoke("createLobby", name, user);
  }

  connectToLobby(user: UserState, lobbyId: string): Promise<void> {
    return this.connection.invoke("connectToLobby", user, lobbyId);
  }

  closeLobby(): Promise<void> {
    return this.connection.invoke("closelobby");
  }

  newGame(name: string): Promise<void> {
    return this.connection.invoke("newGame", name);
  }

  sendPresenterMessage(message: unknown): Promise<void> {
    return this.connection.invoke(
      "hubMessage",
      JSON.stringify({ admin: message })
    );
  }

  sendClientMessage(message: unknown): Promise<void> {
    return this.connection.invoke(
      "hubMessage",
      JSON.stringify({ client: message })
    );
  }

  // State mirroring is a Firebase-transport concern; the .NET backend keeps
  // game state server-side
  publishPresenterState(): Promise<void> {
    return Promise.resolve();
  }

  publishPlayerState(): Promise<void> {
    return Promise.resolve();
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
}
