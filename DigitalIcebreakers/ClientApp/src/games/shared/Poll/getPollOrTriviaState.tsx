import { GamesState, RootState } from "store/RootState";
import { PollState, TriviaState } from "./types/State";

export const getPollOrTriviaState = (state: RootState, gameName: string) => {
  return state.games[gameName as keyof GamesState] as TriviaState | PollState;
};
