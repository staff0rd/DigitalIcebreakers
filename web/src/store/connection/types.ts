import { Player } from "Player";
import { ConnectionStatus } from "../../ConnectionStatus";

export const SET_CONNECTION_STATUS = "SET_CONNECTION_STATUS";
export const CONNECTION_CONNECT = "CONNECTION_CONNECT";

interface SetConnectionStatusAction {
  type: typeof SET_CONNECTION_STATUS;
  status: ConnectionStatus;
}

interface ConnectionConnectAction {
  type: typeof CONNECTION_CONNECT;
  lobbyId: string | undefined;
}

export type ConnectionActionTypes =
  | SetConnectionStatusAction
  | ConnectionConnectAction;

export type ReconnectPayload = {
  playerId: string;
  playerName: string;
  lobbyId: string;
  lobbyName: string;
  isPresenter: boolean;
  players: Player[];
  currentGame: string;
  isRegistered: boolean;
};
