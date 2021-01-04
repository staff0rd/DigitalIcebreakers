import { Answer, TriviaAnswer } from "games/shared/Poll/types/Answer";
import { Question } from "games/shared/Poll/types/Question";

export interface PresenterState<T extends Answer> {
  currentQuestionId: string | undefined;
  showResponses: boolean;
  questions: Question<T>[];
}

export type PollPresenterState = PresenterState<Answer>;

export type TriviaPresenterState = PresenterState<TriviaAnswer> & {
  showScoreBoard: boolean;
};
