import { combineReducers } from 'redux'
import { createReceiveReducer, createReceiveGameMessageReducer, createGameActionWithPayload, createGameAction } from '../../store/actionHelpers';
import { Question } from './Question';
import { guid } from '../../util/guid';

export const Name = "polling";

export interface PollingState {
    player: PollingPlayerState,
    presenter: PollingPresenterState,
}

interface PollingPlayerState {

}

interface PollingPresenterState {
    questions: Question[],
}

// export const resetScores = createGameAction(Name, "presenter", "reset-scores");
export const addQuestionAction = createGameActionWithPayload<string>(Name, "presenter", "add-question");

const presenterReducer = createReceiveGameMessageReducer<PollingPresenterState>(
    Name, 
    {
        questions: [],
    },
    (state, action) => ({
        ...state,
    }),
    "presenter",
    (builder) => {
        builder.addCase(addQuestionAction, (state, action) => ({
            ...state,
            questions: [...state.questions, { 
                id: action.payload,
                isVisible: true,
                order: state.questions.length,
                responses: [],
                text: 'Change this text to your question',
                answers: [{
                    id: guid(),
                    text: 'An answer'
                }],
             }],
        }));
    }
);

const playerReducer = createReceiveReducer<PollingPlayerState>(
    Name,
    {
        
    }, 
    (state, action) => {
        
    }, 
    "client"
);

export const pollingReducer = combineReducers<PollingState>({
    player: playerReducer,
    presenter: presenterReducer,
});

