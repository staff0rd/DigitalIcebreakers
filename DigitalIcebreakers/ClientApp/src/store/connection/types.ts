import { ConnectionStatus } from "../../ConnectionStatus";

export interface ConnectionState {
    status: ConnectionStatus
}

export const SET_CONNECTION_STATUS = 'SET_CONNECTION_STATUS';

interface SetConnectionStatusAction {
    type: typeof SET_CONNECTION_STATUS
    status: ConnectionStatus
}
  
export type ConnectionActionTypes = SetConnectionStatusAction;
