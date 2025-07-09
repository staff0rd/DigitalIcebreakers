import { combineReducers } from "redux";
import { connectionReducer } from "./connection/reducers";
import { userReducer } from "./user/reducers";
import { lobbyReducer } from "./lobby/reducers";
import { shellReducer } from "./shell/reducers";
import { ideaWallReducer } from "games/IdeaWall/IdeaWallReducer";
import { pollReducer } from "games/Poll/reducers/pollReducer";
import { triviaReducer } from "games/Trivia/reducers/triviaReducer";
import { retrospectiveReducer } from "games/Retrospective/reducer";

const gamesReducer = combineReducers({
  ideawall: ideaWallReducer,
  poll: pollReducer,
  trivia: triviaReducer,
  retrospective: retrospectiveReducer,
});

export const rootReducer = combineReducers({
  connection: connectionReducer,
  user: userReducer,
  lobby: lobbyReducer,
  shell: shellReducer,
  games: gamesReducer,
});
