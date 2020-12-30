import { Player } from "Player";
import { ConnectionStatus } from "../../ConnectionStatus";

export interface ConnectionState {
  status: ConnectionStatus;
}

export const SET_CONNECTION_STATUS = "SET_CONNECTION_STATUS";
export const CONNECTION_CONNECT = "CONNECTION_CONNECT";
export const CONNECTION_RECONNECT = "CONNECTION_RECONNECT";
export const SET_GAME_MESSAGE_CALLBACK = "SET_GAME_MESSAGE_CALLBACK";

interface SetConnectionStatusAction {
  type: typeof SET_CONNECTION_STATUS;
  status: ConnectionStatus;
}

interface ConnectionConnectAction {
  type: typeof CONNECTION_CONNECT;
  lobbyId: string | undefined;
}

interface ConnectionReconnectAction {
  type: typeof CONNECTION_RECONNECT;
}

interface SetGameMessageCallbackAction {
  type: typeof SET_GAME_MESSAGE_CALLBACK;
  callback: Function;
}

export type ConnectionActionTypes =
  | SetConnectionStatusAction
  | ConnectionConnectAction
  | ConnectionReconnectAction
  | SetGameMessageCallbackAction;

export type ReconnectPayload = {
  playerId: string;
  playerName: string;
  lobbyId: string;
  lobbyName: string;
  isAdmin: boolean;
  players: Player[];
  currentGame: string;
  isRegistered: boolean;
};
