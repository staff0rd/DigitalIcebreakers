import { combineReducers } from 'redux'
import { connectionReducer } from './connection/reducers'
import { userReducer } from './user/reducers'
import { RootState, GamesState } from './RootState'
import { lobbyReducer } from './lobby/reducers'
import { shellReducer } from './shell/reducers';
import { yesNoMaybeReducer } from '../games/YesNoMaybe/YesNoMaybeReducer';
import { doggosVsKittehsReducer } from '../games/DoggosVsKittehs/DoggosVsKittehsReducer';

const gamesReducer = combineReducers<GamesState>({
    yesnomaybe: yesNoMaybeReducer,
    doggosVsKittehs: doggosVsKittehsReducer,
});

export const rootReducer = combineReducers<RootState>({
    connection: connectionReducer,
    user: userReducer,
    lobby: lobbyReducer,
    shell: shellReducer,
    games: gamesReducer,
})