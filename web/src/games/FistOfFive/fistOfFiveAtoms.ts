import { atom } from "jotai";
import { registerGame } from "../../store/jotai/gameMessageHandlers";

import { Response } from "../shared/Poll/types/Response";

export interface FistOfFivePresenterState {
  questions: Array<{
    id: string;
    text: string;
    answers: Array<{
      id: string;
      text: string;
    }>;
    responses: Response[];
  }>;
  showResponses: boolean;
  currentQuestionId: string;
}

export interface TriviaPlayerState {
  questionId: string;
  question: string;
  answers: Array<{
    id: string;
    text: string;
  }>;
  selectedAnswerId: string;
  answerLocked: boolean;
  canAnswer: boolean;
}

export interface FistOfFiveState {
  presenter: FistOfFivePresenterState;
  player: TriviaPlayerState;
}

const fiveFingers = () =>
  Array.from({ length: 5 }, (_, ix) => ({
    id: `${ix + 1}`,
    text: `${ix + 1}`,
  }));

export const initialFistOfFiveState = (): FistOfFiveState => ({
  presenter: {
    questions: [
      {
        id: "0",
        text: "",
        answers: fiveFingers(),
        responses: [],
      },
    ],
    showResponses: false,
    currentQuestionId: "0",
  },
  player: {
    questionId: "0",
    question: "",
    answers: fiveFingers(),
    selectedAnswerId: "",
    answerLocked: false,
    canAnswer: true,
  },
});

export const fistOfFiveAtom = atom<FistOfFiveState>(initialFistOfFiveState());

// The presenter aggregates raw player answers; players keep their state local
const handleFistOfFiveMessage = (
  currentState: FistOfFiveState,
  message: any,
  isPresenter: boolean
): FistOfFiveState => {
  if (!isPresenter) {
    return currentState;
  }

  const { id: playerId, name: playerName, payload } = message ?? {};
  const answers = Array.isArray(payload) ? payload : payload ? [payload] : [];
  const answerId = answers[0]?.answerId;
  if (!playerId || !playerName || !answerId) {
    return currentState;
  }

  const updatedQuestions = currentState.presenter.questions.map((q) => ({
    ...q,
    responses: [
      ...q.responses.filter((r) => r.playerId !== playerId),
      { playerId, playerName, answerId },
    ],
  }));

  return {
    ...currentState,
    presenter: {
      ...currentState.presenter,
      questions: updatedQuestions,
    },
  };
};

registerGame("fist-of-five", fistOfFiveAtom, handleFistOfFiveMessage, {
  resetState: () => initialFistOfFiveState(),
});
