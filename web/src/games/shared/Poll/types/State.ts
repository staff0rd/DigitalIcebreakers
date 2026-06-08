import {
  PollPlayerState,
  TriviaPlayerState,
} from "games/shared/Poll/types/PlayerState";
import {
  PollPresenterState,
  TriviaPresenterState,
  FistOfFivePresenterState,
} from "games/shared/Poll/types/PresenterState";

export interface PollState {
  player: PollPlayerState;
  presenter: PollPresenterState;
}

export interface TriviaState {
  player: TriviaPlayerState;
  presenter: TriviaPresenterState;
}

export interface FistOfFiveState {
  player: TriviaPlayerState;
  presenter: FistOfFivePresenterState;
}
