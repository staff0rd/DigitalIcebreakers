import { combineReducers } from "redux";
import { connectionReducer } from "./connection/reducers";
import { userReducer } from "./user/reducers";
import { lobbyReducer } from "./lobby/reducers";
import { shellReducer } from "./shell/reducers";
import { retrospectiveReducer } from "games/Retrospective/reducer";

const gamesReducer = combineReducers({
  retrospective: retrospectiveReducer,
});

export const rootReducer = combineReducers({
  connection: connectionReducer,
  user: userReducer,
  lobby: lobbyReducer,
  shell: shellReducer,
  games: gamesReducer,
});
