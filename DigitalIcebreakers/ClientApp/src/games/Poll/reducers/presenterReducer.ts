import { createReceiveGameMessageReducer, createGameAction, createGameActionWithPayload } from '../../../store/actionHelpers';
import { Question } from '../types/Question';
import { guid } from '../../../util/guid';
import { SelectedAnswer } from '../types/SelectedAnswer';
import { PollPresenterState } from '../types/PollPresenterState';
import StorageManager from '../../../store/StorageManager';
import { RootState } from '../../../store/RootState';
import { createSelector } from '@reduxjs/toolkit';
import { Name } from '..';

export const storage = new StorageManager(window.localStorage);
export const storageKey = "poll:questions";

export const exportQuestionsAction = createGameAction(Name, "presenter", "export-questions");
export const toggleResponsesAction = createGameAction(Name, "presenter", "toggle-responses");
export const clearResponsesAction = createGameAction(Name, "presenter", "clear-responses");
export const addQuestionAction = createGameActionWithPayload<string>(Name, "presenter", "add-question");
export const updateQuestionAction = createGameActionWithPayload<Question>(Name, "presenter", "update-question");
export const deleteQuestionAction = createGameActionWithPayload<Question>(Name, "presenter", "delete-question");
export const importQuestionsAction = createGameActionWithPayload<Question[]>(Name, "presenter", "import-questions");
export const setCurrentQuestionAction = createGameActionWithPayload<string>(Name, "presenter", "set-current-question");

export const currentQuestionSelector = createSelector(
    (state: RootState) => ({
        currentQuestionId: state.games.poll.presenter.currentQuestionId,
        questions: state.games.poll.presenter.questions,
    }),
    (state) => { 
        const question = state.questions.find(q => q.id === (state.currentQuestionId || ""));
        const currentQuestionId = state.currentQuestionId;
        const responseCount = (question?.responses?.length) || 0;
        const questionIds = state.questions.map(q => q.id);
        const currentQuestionIndex = currentQuestionId ? questionIds.indexOf(currentQuestionId) : -1;
        const previousQuestionId = currentQuestionIndex > 0 ? questionIds[currentQuestionIndex-1] : null;
        const nextQuestionId = currentQuestionIndex != -1 && currentQuestionIndex < questionIds.length + 1 ? 
        questionIds[currentQuestionIndex+1] : null;
        return {
            currentQuestionId,
            question,
            questionIds,
            responseCount,
            previousQuestionId,
            nextQuestionId,
        };
    }
);


export const presenterReducer = createReceiveGameMessageReducer<SelectedAnswer, PollPresenterState>(
    Name,
    {
        questions: storage.getFromStorage(storageKey) || [],
        currentQuestionId: undefined,
        showResponses: false,
    },
    (state, { payload: { id: playerId, name: playerName, payload: { questionId, selectedId: answerId, }, } }) => {
        const question = state.questions.find(q => q.id === questionId && state.currentQuestionId === questionId);
        if (!question) {
            return state;
        }
        const questions: Question[] = state.questions.map(q => {
            if (q.id === question.id) {
                return {
                    ...q,
                    responses: [
                        ...q.responses.filter(r => r.playerId !== playerId),
                        { playerName, playerId, answerId },
                    ]
                };
            }
            else {
                return q;
            }
        });
        return {
            ...state,
            questions,
        };
    },
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
                    text: 'An answer',
                    correct: false,
                }],
            }];
            storage.saveToStorage(storageKey, questions);
            const currentQuestionId = state.questions.length ? state.currentQuestionId : action.payload; // TODO: Why? This is being done because the currentQuestionSelector is not being recalculated unless save is hit
            return {
                currentQuestionId,
                ...state,
                questions,
            };
        });
        builder.addCase(updateQuestionAction, (state, { payload: question }) => {
            const questions = state.questions.map(q => q.id !== question.id ? q : question);
            storage.saveToStorage(storageKey, questions);
            return {
                ...state,
                questions,
            };
        });
        builder.addCase(deleteQuestionAction, (state, { payload: question }) => {
            const questions = state.questions.filter(q => q.id !== question.id);
            storage.saveToStorage(storageKey, questions);
            return {
                ...state,
                questions,
            };
        });
        builder.addCase(importQuestionsAction, (state, { payload: questions }) => {
            storage.saveToStorage(storageKey, questions);
            let currentQuestionId: string | undefined;
            if (questions.length) {
                currentQuestionId = questions[0].id;
            }
            return {
                ...state,
                questions,
                currentQuestionId,
            };
        });
        builder.addCase(setCurrentQuestionAction, (state, { payload: currentQuestionId }) => ({
            ...state,
            currentQuestionId,
        }));
        builder.addCase(toggleResponsesAction, (state) => ({
            ...state,
            showResponses: !state.showResponses
        }));
        builder.addCase(clearResponsesAction, (state) => ({
            ...state,
            questions: state.questions.map(q => ({
                ...q,
                responses: [],
            })),
        }));
    }
);
