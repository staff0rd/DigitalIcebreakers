import { ConnectionStatus } from "../../ConnectionStatus";

export interface ConnectionState {
    status: ConnectionStatus
}

export const SET_CONNECTION_STATUS = 'UPDATE_CONNECTION_STATUS';
export const CONNECTION_CONNECT = 'CONNECTION_CONNECT';
export const CONNECTION_RECONNECT = 'CONNECTION_RECONNECT';
export const SET_GAME_MESSAGE_CALLBACK = 'SET_GAME_MESSAGE_CALLBACK';
export const CLEAR_GAME_MESSAGE_CALLBACK = 'CLEAR_GAME_MESSAGE_CALLBACK';

interface SetConnectionStatusAction {
    type: typeof SET_CONNECTION_STATUS
    status: ConnectionStatus
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

interface ClearGameMessageCallbackAction {
    type: typeof CLEAR_GAME_MESSAGE_CALLBACK;
}

export type ConnectionActionTypes = SetConnectionStatusAction | ConnectionConnectAction | ConnectionReconnectAction | SetGameMessageCallbackAction | ClearGameMessageCallbackAction;
