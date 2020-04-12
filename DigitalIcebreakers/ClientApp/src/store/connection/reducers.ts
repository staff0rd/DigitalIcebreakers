import { ConnectionStatus } from '../../ConnectionStatus'
import {
    ConnectionState,
    ConnectionActionTypes,
    SET_CONNECTION_STATUS
} from './types'

const initialState: ConnectionState = {
    status: ConnectionStatus.NotConnected
}

export function connectionReducer(
    state = initialState,
    action: ConnectionActionTypes
): ConnectionState {
    switch (action.type) {
        case SET_CONNECTION_STATUS: {
            return {
                ...state,
                status: action.status
            }
        }
        default:
            return state
    }
}