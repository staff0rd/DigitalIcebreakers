import { combineReducers } from "redux";
import { connectionReducer } from "./connection/reducers";
import { userReducer } from "./user/reducers";
import { lobbyReducer } from "./lobby/reducers";
import { shellReducer } from "./shell/reducers";
import { pollReducer } from "games/Poll/reducers/pollReducer";
import { triviaReducer } from "games/Trivia/reducers/triviaReducer";

const gamesReducer = combineReducers({
  poll: pollReducer,
  trivia: triviaReducer,
});

export const rootReducer = combineReducers({
  connection: connectionReducer,
  user: userReducer,
  lobby: lobbyReducer,
  shell: shellReducer,
  games: gamesReducer,
});
