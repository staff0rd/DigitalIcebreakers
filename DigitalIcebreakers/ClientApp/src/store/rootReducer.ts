import { combineReducers } from "redux";
import { connectionReducer } from "./connection/reducers";
import { userReducer } from "./user/reducers";
import { RootState, GamesState } from "./RootState";
import { lobbyReducer } from "./lobby/reducers";
import { shellReducer } from "./shell/reducers";
import { yesNoMaybeReducer } from "games/YesNoMaybe/YesNoMaybeReducer";
import { doggosVsKittehsReducer } from "games/DoggosVsKittehs/DoggosVsKittehsReducer";
import { buzzerReducer } from "games/Buzzer/BuzzerReducer";
import { splatReducer } from "games/Splat/SplatReducer";
import { pongReducer } from "games/Pong/PongReducer";
import { ideaWallReducer } from "games/IdeaWall/IdeaWallReducer";
import { pollReducer } from "games/Poll/reducers/pollReducer";
import { triviaReducer } from "games/Trivia/reducers/triviaReducer";
import { namePickerReducer } from "games/NamePicker/NamePickerReducer";
import { broadcastReducer } from "games/Broadcast/BroadcastReducer";
import { reactionReducer } from "games/Reaction/reactionReducer";
import { startStopContinueReducer } from "games/StartStopContinue/reducer";
import { fistOfFiveReducer } from "games/FistOfFive/reducer";

const gamesReducer = combineReducers<GamesState>({
  yesnomaybe: yesNoMaybeReducer,
  doggosVsKittehs: doggosVsKittehsReducer,
  buzzer: buzzerReducer,
  splat: splatReducer,
  pong: pongReducer,
  ideawall: ideaWallReducer,
  poll: pollReducer,
  trivia: triviaReducer,
  namePicker: namePickerReducer,
  broadcast: broadcastReducer,
  reaction: reactionReducer,
  startStopContinue: startStopContinueReducer,
  fistOfFive: fistOfFiveReducer,
});

export const rootReducer = combineReducers<RootState>({
  connection: connectionReducer,
  user: userReducer,
  lobby: lobbyReducer,
  shell: shellReducer,
  games: gamesReducer,
});
