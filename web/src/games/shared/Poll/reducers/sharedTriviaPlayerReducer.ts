import { createReceiveReducer } from "store/actionHelpers";
import { TriviaPlayerState } from "games/shared/Poll/types/PlayerState";
import { playerActionReducer } from "games/shared/Poll/reducers/playerActionReducer";
import { initialPlayerState } from "games/shared/Poll/reducers/initialPlayerState";
import { TriviaPayload } from "../../../Trivia/reducers/triviaPlayerReducer";

export const sharedTriviaPlayerReducer = (gameName: string) =>
  createReceiveReducer<TriviaPayload, TriviaPlayerState>(
    gameName,
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
    playerActionReducer(gameName)
  );
