import { SET_CONNECTION_STATUS as UPDATE_CONNECTION_STATUS, ConnectionActionTypes, CONNECTION_CONNECT, CONNECTION_RECONNECT, CLEAR_GAME_MESSAGE_CALLBACK, SET_GAME_MESSAGE_CALLBACK } from './types';
import { ConnectionStatus } from '../../ConnectionStatus';

export function updateConnectionStatus(status: ConnectionStatus) : ConnectionActionTypes {
    return { type: UPDATE_CONNECTION_STATUS, status };
}

export function connectionConnect(lobbyId?: string) : ConnectionActionTypes {
    return { type: CONNECTION_CONNECT, lobbyId };
}

export function connectionReconnect() : ConnectionActionTypes {
    return { type: CONNECTION_RECONNECT };
}

export function clearGameMessageCallback() : ConnectionActionTypes {
    return { type: CLEAR_GAME_MESSAGE_CALLBACK };
}

export function setGameMessageCallback(callback: Function) : ConnectionActionTypes {
    return { type: SET_GAME_MESSAGE_CALLBACK, callback };
}