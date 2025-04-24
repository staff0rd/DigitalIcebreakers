import {
  SET_CONNECTION_STATUS,
  ConnectionActionTypes,
  CONNECTION_CONNECT,
  CONNECTION_RECONNECT,
} from "./types";
import { ConnectionStatus } from "../../ConnectionStatus";

export function updateConnectionStatus(
  status: ConnectionStatus
): ConnectionActionTypes {
  return { type: SET_CONNECTION_STATUS, status };
}

export function connectionConnect(lobbyId?: string): ConnectionActionTypes {
  return { type: CONNECTION_CONNECT, lobbyId };
}

export function connectionReconnect(): ConnectionActionTypes {
  return { type: CONNECTION_RECONNECT };
}
