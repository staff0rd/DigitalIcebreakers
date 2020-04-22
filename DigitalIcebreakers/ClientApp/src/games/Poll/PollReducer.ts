import { combineReducers } from 'redux'
import { createReceiveReducer, createReceiveGameMessageReducer, createGameActionWithPayload, createGameAction } from '../../store/actionHelpers';
import { Question } from './Question';
import { guid } from '../../util/guid';
import StorageManager from '../../store/StorageManager';

export const Name = "poll";

export interface PollState {
    player: PollPlayerState,
    presenter: PollPresenterState,
}

interface PollPlayerState {

}

interface PollPresenterState {
    questions: Question[],
}

const storage = new StorageManager(window.localStorage);
const storageKey = "poll:questions";

export const exportQuestionsAction = createGameAction(Name, "presenter", "export-questions");
export const addQuestionAction = createGameActionWithPayload<string>(Name, "presenter", "add-question");
export const updateQuestionAction = createGameActionWithPayload<Question>(Name, "presenter", "update-question");
export const deleteQuestionAction = createGameActionWithPayload<Question>(Name, "presenter", "delete-question");
export const importQuestionsAction = createGameActionWithPayload<Question[]>(Name, "presenter", "import-questions");

const presenterReducer = createReceiveGameMessageReducer<PollPresenterState>(
    Name, 
    {
        questions: storage.getFromStorage(storageKey) || [],
    },
    (state, _) => ({
        ...state,
    }),
    "presenter",
    (builder) => {
        builder.addCase(addQuestionAction, (state, action) => {
            const questions = [...state.questions, { 
                id: action.payload,
                isVisible: true,
                order: state.questions.length,
                responses: [],
                text: 'Change this text to your question',
                answers: [{
                    id: guid(),
                    text: 'An answer'
                }],
            }];
            storage.saveToStorage(storageKey, questions);
            return {
                ...state,
                questions,
            };
        });
        builder.addCase(updateQuestionAction, (state, { payload: question}) => {
            const questions = state.questions.map(q => q.id !== question.id ? q : question);
            storage.saveToStorage(storageKey, questions);
            return {
                ...state,
                questions,
            };
        });
        builder.addCase(deleteQuestionAction, (state, { payload: question}) => {
            const questions = state.questions.filter(q => q.id !== question.id);
            storage.saveToStorage(storageKey, questions);
            return {
                ...state,
                questions,
            };
        });
        builder.addCase(importQuestionsAction, (state, { payload: questions}) => {
            storage.saveToStorage(storageKey, questions);
            return {
                ...state,
                questions,
            };
        });
    }
);

const playerReducer = createReceiveReducer<PollPlayerState>(
    Name,
    {
        
    }, 
    (state, action) => {
        
    }, 
    "client"
);

export const pollReducer = combineReducers<PollState>({
    player: playerReducer,
    presenter: presenterReducer,
});

