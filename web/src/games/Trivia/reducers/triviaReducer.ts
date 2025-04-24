import { combineReducers } from "redux";
import { triviaPlayerReducer } from "./triviaPlayerReducer";
import { triviaPresenterReducer } from "./triviaPresenterReducer";

export const triviaReducer = combineReducers({
  player: triviaPlayerReducer,
  presenter: triviaPresenterReducer,
});
