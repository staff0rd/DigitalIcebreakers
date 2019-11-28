import { combineReducers } from 'redux'
import { connectionReducer } from './connection/reducers'
import { userReducer } from './user/reducers'
import { RootState } from './RootState'
import { lobbyReducer } from './lobby/reducers'
import { shellReducer } from './shell/reducers';

export const rootReducer = combineReducers<RootState>({
    connection: connectionReducer,
    user: userReducer,
    lobby: lobbyReducer,
    shell: shellReducer
})