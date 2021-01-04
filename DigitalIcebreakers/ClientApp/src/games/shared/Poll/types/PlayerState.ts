import { Answer, TriviaAnswer } from "games/shared/Poll/types/Answer";
import { AvailableAnswers } from "games/shared/Poll/types/AvailableAnswers";

export interface SelectableAnswer {
  selectedAnswerId?: string;
  answerLocked: boolean;
}

interface PlayerState<T extends Answer>
  extends AvailableAnswers<T>,
    SelectableAnswer {}

export interface PollPlayerState extends PlayerState<Answer> {}

export interface TriviaPlayerState extends PlayerState<TriviaAnswer> {
  canAnswer: boolean;
}
