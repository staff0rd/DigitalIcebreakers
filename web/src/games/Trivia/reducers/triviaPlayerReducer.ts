import { AvailableAnswers } from "games/shared/Poll/types/AvailableAnswers";
import { sharedTriviaPlayerReducer } from "games/shared/Poll/reducers/sharedTriviaPlayerReducer";

const TriviaName = "trivia";

interface CanAnswer {
  canAnswer: boolean;
}

export type TriviaPayload = AvailableAnswers & CanAnswer;

export const triviaPlayerReducer = sharedTriviaPlayerReducer(TriviaName);
