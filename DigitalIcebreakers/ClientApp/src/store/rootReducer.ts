import { combineReducers } from 'redux'
import { connectionReducer } from './connection/reducers'
import { RootState } from './RootState'

export const rootReducer = combineReducers<RootState>({
    connection: connectionReducer
})