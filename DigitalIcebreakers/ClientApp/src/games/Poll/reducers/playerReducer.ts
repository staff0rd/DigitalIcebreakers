import {
  createReceiveReducer,
  createGameActionWithPayload,
  createGameAction,
} from "../../../store/actionHelpers";
import { AvailableAnswers } from "../types/AvailableAnswers";
import { PollPlayerState } from "../types/PollPlayerState";
import { Name } from "..";

export const selectAnswerAction = createGameActionWithPayload<string>(
  Name,
  "client",
  "select-answer"
);
export const lockAnswerAction = createGameAction(Name, "client", "lock-answer");

interface CanAnswer {
  canAnswer: boolean;
}

type Payload = AvailableAnswers & CanAnswer;

export const playerReducer = createReceiveReducer<Payload, PollPlayerState>(
  Name,
  {
    answers: [],
    questionId: "",
    answerLocked: false,
    canAnswer: true,
    question: "",
  },
  (state, { payload: availableAnswers }) => {
    if (availableAnswers.canAnswer !== undefined) {
      return { ...state, canAnswer: availableAnswers.canAnswer };
    }
    return {
      ...state,
      ...availableAnswers,
      answerLocked: !!availableAnswers.selectedAnswerId,
    };
  },
  "client",
  (builder) => {
    builder.addCase(
      selectAnswerAction,
      (state, { payload: selectedAnswerId }) => ({
        ...state,
        selectedAnswerId,
      })
    );
    builder.addCase(lockAnswerAction, (state) => ({
      ...state,
      answerLocked: true,
    }));
  }
);
