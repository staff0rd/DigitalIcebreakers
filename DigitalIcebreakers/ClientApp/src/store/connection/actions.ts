import { SET_CONNECTION_STATUS, ConnectionActionTypes } from './types';
import { ConnectionStatus } from '../../ConnectionStatus';

export function setConnectionStatus(status: ConnectionStatus) : ConnectionActionTypes {
    return { type: SET_CONNECTION_STATUS, status }
}
