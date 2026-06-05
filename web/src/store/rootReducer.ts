import { combineReducers } from "redux";
import { lobbyReducer } from "./lobby/reducers";
import { shellReducer } from "./shell/reducers";

export const rootReducer = combineReducers({
  lobby: lobbyReducer,
  shell: shellReducer,
});
