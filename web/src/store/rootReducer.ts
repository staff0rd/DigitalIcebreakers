import { combineReducers } from "redux";
import { connectionReducer } from "./connection/reducers";
import { userReducer } from "./user/reducers";
import { lobbyReducer } from "./lobby/reducers";
import { shellReducer } from "./shell/reducers";
import { pongReducer } from "games/Pong/PongReducer";
import { ideaWallReducer } from "games/IdeaWall/IdeaWallReducer";
import { pollReducer } from "games/Poll/reducers/pollReducer";
import { triviaReducer } from "games/Trivia/reducers/triviaReducer";
import { reactionReducer } from "games/Reaction/reactionReducer";
import { retrospectiveReducer } from "games/Retrospective/reducer";

const gamesReducer = combineReducers({
  pong: pongReducer,
  ideawall: ideaWallReducer,
  poll: pollReducer,
  trivia: triviaReducer,
  reaction: reactionReducer,
  retrospective: retrospectiveReducer,
});

export const rootReducer = combineReducers({
  connection: connectionReducer,
  user: userReducer,
  lobby: lobbyReducer,
  shell: shellReducer,
  games: gamesReducer,
});
