import { combineReducers } from "redux";
import { connectionReducer } from "./connection/reducers";
import { userReducer } from "./user/reducers";
import { lobbyReducer } from "./lobby/reducers";
import { shellReducer } from "./shell/reducers";
import { doggosVsKittehsReducer } from "games/DoggosVsKittehs/DoggosVsKittehsReducer";
import { buzzerReducer } from "games/Buzzer/BuzzerReducer";
import { splatReducer } from "games/Splat/SplatReducer";
import { pongReducer } from "games/Pong/PongReducer";
import { ideaWallReducer } from "games/IdeaWall/IdeaWallReducer";
import { pollReducer } from "games/Poll/reducers/pollReducer";
import { triviaReducer } from "games/Trivia/reducers/triviaReducer";
import { reactionReducer } from "games/Reaction/reactionReducer";
import { retrospectiveReducer } from "games/Retrospective/reducer";
import { fistOfFiveReducer } from "games/FistOfFive/reducer";

const gamesReducer = combineReducers({
  doggosVsKittehs: doggosVsKittehsReducer,
  buzzer: buzzerReducer,
  splat: splatReducer,
  pong: pongReducer,
  ideawall: ideaWallReducer,
  poll: pollReducer,
  trivia: triviaReducer,
  reaction: reactionReducer,
  retrospective: retrospectiveReducer,
  fistOfFive: fistOfFiveReducer,
});

export const rootReducer = combineReducers({
  connection: connectionReducer,
  user: userReducer,
  lobby: lobbyReducer,
  shell: shellReducer,
  games: gamesReducer,
});
