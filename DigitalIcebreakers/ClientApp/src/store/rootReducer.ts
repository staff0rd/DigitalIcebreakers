import { combineReducers } from 'redux'
import { connectionReducer } from './connection/reducers'
import { userReducer } from './user/reducers'
import { RootState } from './RootState'
import { lobbyReducer } from './lobby/reducers'

export const rootReducer = combineReducers<RootState>({
    connection: connectionReducer,
    user: userReducer,
    lobby: lobbyReducer
})