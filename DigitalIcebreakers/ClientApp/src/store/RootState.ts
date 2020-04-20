import { ConnectionState } from './connection/types'
import { UserState } from './user/types';
import { LobbyState } from './lobby/types';
import { ShellState } from './shell/types'
import { YesNoMaybeState } from '../games/YesNoMaybe/YesNoMaybeReducer';
import { Player } from '../games/Buzzer/BuzzerReducer';
import { SplatState } from '../games/Splat/SplatReducer';

export interface GamesState {
    yesnomaybe: YesNoMaybeState,
    doggosVsKittehs: YesNoMaybeState,
    buzzer: Player[],
    splat: SplatState,
}

export interface RootState {
    connection: ConnectionState
    user: UserState
    lobby: LobbyState
    shell: ShellState,
    games: GamesState,
}