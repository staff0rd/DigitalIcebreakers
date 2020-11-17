import { combineReducers } from 'redux'
import { playerReducer } from './playerReducer';
import { presenterReducer } from './presenterReducer';
import { PollState } from '../types/PollState';

export const pollReducer = combineReducers<PollState>({
    player: playerReducer,
    presenter: presenterReducer,
});

