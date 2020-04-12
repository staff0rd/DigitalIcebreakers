import {ConnectionState} from './connection/types'
import { UserState } from './user/types';

export interface RootState {
    connection: ConnectionState
    user: UserState
}