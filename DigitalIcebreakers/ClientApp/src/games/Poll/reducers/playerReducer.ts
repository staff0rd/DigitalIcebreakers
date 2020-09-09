import { createReceiveReducer, createGameActionWithPayload, createGameAction } from '../../../store/actionHelpers';
import { AvailableAnswers } from '../types/AvailableAnswers';
import { PollPlayerState } from "../types/PollPlayerState";
import { Name } from '..';

export const selectAnswerAction = createGameActionWithPayload<string>(Name, "client", "select-answer");
export const lockAnswerAction = createGameAction(Name, "client", "lock-answer");

export const playerReducer = createReceiveReducer<PollPlayerState, AvailableAnswers>(
    Name,
    {
        answers: [],
        questionId: '',
        answerLocked: false,
    },
    (state, { payload: availableAnswers }) => ({
        ...state,
        ...availableAnswers,
        answerLocked: false,
        selectedAnswerId: undefined,
    }),
    "client",
    (builder) => {
        builder.addCase(selectAnswerAction, (state, { payload: selectedAnswerId }) => ({
            ...state,
            selectedAnswerId,
        }));
        builder.addCase(lockAnswerAction, (state) => ({
            ...state,
            answerLocked: true,
        }));
    }
);
