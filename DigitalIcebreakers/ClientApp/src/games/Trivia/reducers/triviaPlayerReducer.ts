import { createReceiveReducer } from "store/actionHelpers";
import { AvailableAnswers } from "games/shared/Poll/types/AvailableAnswers";
import { TriviaPlayerState } from "games/shared/Poll/types/PlayerState";
import { playerActionReducer } from "games/shared/Poll/reducers/playerActionReducer";
import { initialPlayerState } from "games/shared/Poll/reducers/initialPlayerState";

const TriviaName = "trivia";

interface CanAnswer {
  canAnswer: boolean;
}

type TriviaPayload = AvailableAnswers & CanAnswer;

export const triviaPlayerReducer = createReceiveReducer<
  TriviaPayload,
  TriviaPlayerState
>(
  TriviaName,
  { ...initialPlayerState, canAnswer: false },
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
  playerActionReducer(TriviaName)
);
