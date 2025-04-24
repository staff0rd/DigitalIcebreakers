import { combineReducers } from "redux";
import { pollPlayerReducer } from "./pollPlayerReducer";
import { pollPresenterReducer } from "./pollPresenterReducer";

export const pollReducer = combineReducers({
  player: pollPlayerReducer,
  presenter: pollPresenterReducer,
});
