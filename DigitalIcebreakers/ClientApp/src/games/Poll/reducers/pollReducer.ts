import { combineReducers } from "redux";
import { pollPlayerReducer } from "./pollPlayerReducer";
import { PollState } from "games/shared/Poll/types/State";
import { pollPresenterReducer } from "./pollPresenterReducer";

export const pollReducer = combineReducers<PollState>({
  player: pollPlayerReducer,
  presenter: pollPresenterReducer,
});
