import { ConnectionState } from './connection/types'
import { UserState } from './user/types';
import { LobbyState } from './lobby/types';

export interface RootState {
    connection: ConnectionState
    user: UserState
    lobby: LobbyState
}