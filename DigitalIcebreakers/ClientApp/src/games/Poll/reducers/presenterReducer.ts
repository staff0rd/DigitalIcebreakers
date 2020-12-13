import { createReceiveGameMessageReducer, createGameAction, createGameActionWithPayload } from '../../../store/actionHelpers';
import { Question } from '../types/Question';
import { Response } from '../types/Response';
import { guid } from '../../../util/guid';
import { SelectedAnswer } from '../types/SelectedAnswer';
import { PollPresenterState } from '../types/PollPresenterState';
import StorageManager from '../../../store/StorageManager';
import { RootState } from '../../../store/RootState';
import { createSelector } from '@reduxjs/toolkit';
import { Name } from '..';
import { Player } from 'Player';

export const storage = new StorageManager(window.localStorage);
export const storageKey = "poll:questions";

export const exportQuestionsAction = createGameAction(Name, "presenter", "export-questions");
export const toggleShowResponsesAction = createGameAction(Name, "presenter", "toggle-show-responses");
export const toggleShowScoreBoardAction = createGameAction(Name, "presenter", "toggle-show-scoreboard");
export const clearResponsesAction = createGameAction(Name, "presenter", "clear-responses");
export const addQuestionAction = createGameActionWithPayload<string>(Name, "presenter", "add-question");
export const updateQuestionAction = createGameActionWithPayload<Question>(Name, "presenter", "update-question");
export const deleteQuestionAction = createGameActionWithPayload<Question>(Name, "presenter", "delete-question");
export const importQuestionsAction = createGameActionWithPayload<Question[]>(Name, "presenter", "import-questions");
export const setCurrentQuestionAction = createGameActionWithPayload<string>(Name, "presenter", "set-current-question");

type UserScore = {
    name: string;
    id: string;
    score: number;
}

const sort = (userScores: UserScore[]) => {
    return userScores.sort((n1,n2) => {
        if (n1.score < n2.score) {
            return 1;
        }
    
        if (n1.score > n2.score) {
            return -1;
        }
    
        return 0;
    });

}

const getPlayersWithNoScore = (players: Player[], scores: UserScore[]) => players
    .filter(user => !scores.find(score => score.id === user.id))
    .map(user => ({ name: user.name, score: 0, id: user.id}));

export const scoreBoardSelector = createSelector(
    (state: RootState) => ({
        questions: state.games.poll.presenter.questions,
        users: state.lobby.players,
    }),
    (state) => {
        const correctResponsesAsIds = state.questions.map(q => {
            const correctAnswer = q.answers.find(a => a.correct);
            const correctResponses = q.responses.filter(r => r.answerId == correctAnswer?.id);
            return correctResponses;
        });

        /// https://schneidenbach.gitbooks.io/typescript-cookbook/content/functional-programming/flattening-array-of-arrays.html
        const flattened = ([] as Response[]).concat(...correctResponsesAsIds);

        const ids = flattened.map(p => p.playerId);
        const onlyUnique = <T>(value: T, index: number, self: T[]) => self.indexOf(value) === index;
        const uniqueIds = ids.filter(onlyUnique);

        const scores = uniqueIds.map(u => ({
            name: flattened!.find(r => u === r.playerId)!.playerName,
            id: u,
            score: flattened.filter(id => id.playerId === u).length,
        }));
        
        const sorted = sort(scores);
        
        sorted.push(...getPlayersWithNoScore(state.users, scores));
        
        return {
            scores: sorted,
        };
    }
)

export const currentQuestionSelector = createSelector(
    (state: RootState) => ({
        currentQuestionId: state.games.poll.presenter.currentQuestionId,
        questions: state.games.poll.presenter.questions,
    }),
    (state) => { 
        const question = state.questions.find(q => q.id === (state.currentQuestionId || ""));
        const currentQuestionId = state.currentQuestionId;
        const totalQuestions = state.questions.length;
        const responseCount = (question?.responses?.length) || 0;
        const isTriviaMode = !!state.questions.filter(q => q.answers.find(a => a.correct)).length;
        const questionIds = state.questions.map(q => q.id);
        const currentQuestionIndex = currentQuestionId ? questionIds.indexOf(currentQuestionId) : -1;
        const currentQuestionNumber = currentQuestionIndex + 1;
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
            isTriviaMode,
            currentQuestionNumber,
            totalQuestions,
        };
    }
);


export const presenterReducer = createReceiveGameMessageReducer<SelectedAnswer[], PollPresenterState>(
    Name,
    {
        questions: storage.getFromStorage(storageKey) || [],
        currentQuestionId: undefined,
        showResponses: false,
        showScoreBoard: false,
    },
    (state, { payload: { id: playerId, name: playerName, payload: answers, } }) => {
        const questions: Question[] = state.questions.map(q => {
            const answer = answers.find(a => a.questionId === q.id);
            if (answer) {
                return {
                    ...q,
                    responses: [
                        ...q.responses.filter(r => r.playerId !== playerId),
                        { playerName, playerId, answerId: answer.answerId },
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
        builder.addCase(setCurrentQuestionAction, (state, { payload: currentQuestionId }) => {
            const newQuestion = state.questions.find(q => q.id === currentQuestionId);
            let showResponses = state.showResponses;
            if (newQuestion && newQuestion.answers.filter(a => a.correct).length)
                showResponses = false;
            return {
                ...state,
                showScoreBoard: false,
                showResponses,
                currentQuestionId,
            }
        });
        builder.addCase(toggleShowResponsesAction, (state) => ({
            ...state,
            showResponses: !state.showResponses
        }));
        builder.addCase(toggleShowScoreBoardAction, (state) => ({
            ...state,
            showScoreBoard: !state.showScoreBoard
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
