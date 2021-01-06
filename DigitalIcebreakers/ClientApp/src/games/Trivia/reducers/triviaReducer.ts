import { combineReducers } from "redux";
import { triviaPlayerReducer } from "./triviaPlayerReducer";
import { TriviaState } from "games/shared/Poll/types/State";
import { triviaPresenterReducer } from "./triviaPresenterReducer";

export const triviaReducer = combineReducers<TriviaState>({
  player: triviaPlayerReducer,
  presenter: triviaPresenterReducer,
});
