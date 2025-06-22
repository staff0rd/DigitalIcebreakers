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

// Create atoms for FistOfFive state
export const fistOfFiveAtom = atom<FistOfFiveState>({
  presenter: {
    questions: [
      {
        id: "0",
        text: "",
        answers: [
          { id: "1", text: "1" },
          { id: "2", text: "2" },
          { id: "3", text: "3" },
          { id: "4", text: "4" },
          { id: "5", text: "5" },
        ],
        responses: [],
      },
    ],
    showResponses: false,
    currentQuestionId: "0",
  },
  player: {
    questionId: "0",
    question: "",
    answers: [
      { id: "1", text: "1" },
      { id: "2", text: "2" },
      { id: "3", text: "3" },
      { id: "4", text: "4" },
      { id: "5", text: "5" },
    ],
    selectedAnswerId: "",
    answerLocked: false,
    canAnswer: true,
  },
});

// Message handler for FistOfFive
const handleFistOfFiveMessage = (
  currentState: FistOfFiveState,
  message: any,
  isPresenter: boolean
): FistOfFiveState => {
  // Handle both direct messages and wrapped messages
  let type: string;
  let payload: any;

  if (message.type) {
    // Direct message format
    type = message.type;
    payload = message.payload;
  } else {
    // The message might be the payload itself for presenter messages
    // When a client sends a message, it comes as the direct payload
    type = isPresenter ? "presenter" : "client";
    payload = message;
  }

  switch (type) {
    case "games/FistOfFive/presenterReceiveScores":
      return {
        ...currentState,
        presenter: {
          ...currentState.presenter,
          questions: payload,
        },
      };

    case "games/FistOfFive/toggleResponses":
      return {
        ...currentState,
        presenter: {
          ...currentState.presenter,
          showResponses: !currentState.presenter.showResponses,
        },
      };

    case "games/Poll/toggleResponses": // Reuses Poll action
      return {
        ...currentState,
        presenter: {
          ...currentState.presenter,
          showResponses: !currentState.presenter.showResponses,
        },
      };

    case "games/FistOfFive/playerReceiveQuestion":
    case "games/Poll/playerReceiveQuestion": // Reuses Poll action
      return {
        ...currentState,
        player: {
          ...currentState.player,
          questionId: payload.questionId,
          question: payload.question || "",
          answers: payload.answers || currentState.player.answers,
          selectedAnswerId: "",
          answerLocked: false,
          canAnswer: true,
        },
      };

    case "games/FistOfFive/setPlayerSelectedAnswer":
    case "games/Poll/setPlayerSelectedAnswer": // Reuses Poll action
      return {
        ...currentState,
        player: {
          ...currentState.player,
          selectedAnswerId: payload,
        },
      };

    case "games/FistOfFive/lockPlayerAnswer":
    case "games/Poll/lockPlayerAnswer": // Reuses Poll action
      return {
        ...currentState,
        player: {
          ...currentState.player,
          answerLocked: true,
        },
      };

    case "games/FistOfFive/clearScores":
    case "games/Poll/clearScores": // Reuses Poll action
      // Reset scores but keep the question structure
      return {
        ...currentState,
        presenter: {
          ...currentState.presenter,
          questions: [
            {
              id: "0",
              text: "",
              answers: [
                { id: "1", text: "1" },
                { id: "2", text: "2" },
                { id: "3", text: "3" },
                { id: "4", text: "4" },
                { id: "5", text: "5" },
              ],
              responses: [],
            },
          ],
          showResponses: false,
        },
        player: {
          ...currentState.player,
          selectedAnswerId: "",
          answerLocked: false,
          canAnswer: true,
        },
      };

    case "games/FistOfFive/presenterReceivePlayerMessage":
    case "presenter": {
      // Generic presenter message
      // Handle incoming player responses
      if (!isPresenter) return currentState;

      // The payload structure is: { payload: [{questionId, answerId}], id: playerId, name: playerName }
      const { id: playerId, name: playerName, payload: answers } = payload;
      if (!answers || !answers.length) return currentState;

      const answerId = answers[0].answerId;
      const updatedQuestions = currentState.presenter.questions.map((q) => {
        // Remove any existing response from this player
        const filteredResponses = q.responses.filter(
          (r) => r.playerId !== playerId
        );
        // Add the new response
        return {
          ...q,
          responses: [...filteredResponses, { playerId, playerName, answerId }],
        };
      });

      return {
        ...currentState,
        presenter: {
          ...currentState.presenter,
          questions: updatedQuestions,
        },
      };
    }
    default:
      return currentState;
  }
};

// Register the game with the SignalR middleware
registerGame("fist-of-five", fistOfFiveAtom, handleFistOfFiveMessage);
