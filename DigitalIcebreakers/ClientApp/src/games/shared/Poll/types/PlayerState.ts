import { AvailableAnswers } from "games/shared/Poll/types/AvailableAnswers";

export interface SelectableAnswer {
  selectedAnswerId?: string;
  answerLocked: boolean;
}

interface PlayerState extends AvailableAnswers, SelectableAnswer {}

export interface PollPlayerState extends PlayerState {}

export interface TriviaPlayerState extends PlayerState {
  canAnswer: boolean;
}
