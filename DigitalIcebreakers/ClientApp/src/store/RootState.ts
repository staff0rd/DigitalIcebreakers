import { ConnectionState } from './connection/types'
import { UserState } from './user/types';
import { LobbyState } from './lobby/types';
import { ShellState } from './shell/types'
import { YesNoMaybeState } from '../games/YesNoMaybe/YesNoMaybeReducer';
import { Player } from '../games/Buzzer/BuzzerReducer';
import { SplatState } from '../games/Splat/SplatReducer';
import { TeamColors, PaddleDy, PongPresenterState } from '../games/Pong/PongReducer';

export interface GamesState {
    yesnomaybe: YesNoMaybeState,
    doggosVsKittehs: YesNoMaybeState,
    buzzer: Player[],
    splat: SplatState,
    pong: {
        client: TeamColors,
        presenter: PongPresenterState,
    }
}

export interface RootState {
    connection: ConnectionState
    user: UserState
    lobby: LobbyState
    shell: ShellState,
    games: GamesState,
}