import { Player } from "../../Player";
import { ReconnectPayload } from "../connection/types";
import { UserState } from "../user/types";

export type TransportEventHandlers = {
  reconnect: (payload: ReconnectPayload) => void;
  joined: (player: Player) => void;
  left: (player: Player) => void;
  players: (players: Player[]) => void;
  closelobby: () => void;
  connected: () => void;
  newgame: (name: string) => void;
  gameMessage: (message: unknown) => void;
  connectionclosed: () => void;
};

export type TransportEvent = keyof TransportEventHandlers;

export interface Transport {
  start(): Promise<void>;
  connect(user: UserState, lobbyId?: string): Promise<void>;
  createLobby(name: string, user: UserState): Promise<void>;
  connectToLobby(user: UserState, lobbyId: string): Promise<void>;
  closeLobby(): Promise<void>;
  newGame(name: string): Promise<void>;
  sendPresenterMessage(message: unknown): Promise<void>;
  sendClientMessage(message: unknown): Promise<void>;
  publishPresenterState(state: unknown): Promise<void>;
  publishPlayerState(state: unknown): Promise<void>;
  on<E extends TransportEvent>(
    event: E,
    handler: TransportEventHandlers[E]
  ): void;
  off(event: TransportEvent): void;
}
