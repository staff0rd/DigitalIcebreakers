import { Question } from "games/shared/Poll/types/Question";

export interface PresenterState {
  currentQuestionId: string | undefined;
  showResponses: boolean;
  questions: Question[];
}

export type PollPresenterState = PresenterState;

export type TriviaPresenterState = PresenterState & {
  showScoreBoard: boolean;
};
