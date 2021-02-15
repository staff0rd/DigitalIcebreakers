import { ConnectionState } from "./connection/types";
import { UserState } from "./user/types";
import { LobbyState } from "./lobby/types";
import { ShellState } from "./shell/types";
import { YesNoMaybeState } from "../games/YesNoMaybe/YesNoMaybeReducer";
import { Player } from "../games/Buzzer/BuzzerReducer";
import { SplatState } from "../games/Splat/SplatReducer";
import { PongClientState, PongPresenterState } from "../games/Pong/PongReducer";
import { IdeaWallState } from "../games/IdeaWall/IdeaWallReducer";
import { FistOfFiveState, PollState } from "../games/shared/Poll/types/State";
import { TriviaState } from "games/shared/Poll/types/State";
import { NamePickerState } from "../games/NamePicker/NamePickerReducer";
import { BroadcastState } from "games/Broadcast/BroadcastReducer";
import { ReactionState } from "games/Reaction/reactionReducer";
import { StartStopContinueState } from "games/StartStopContinue/reducer";

export interface GamesState {
  yesnomaybe: YesNoMaybeState;
  doggosVsKittehs: YesNoMaybeState;
  buzzer: Player[];
  splat: SplatState;
  pong: {
    client: PongClientState;
    presenter: PongPresenterState;
  };
  ideawall: IdeaWallState;
  poll: PollState;
  trivia: TriviaState;
  namePicker: NamePickerState;
  broadcast: BroadcastState;
  reaction: ReactionState;
  startStopContinue: StartStopContinueState;
  fistOfFive: FistOfFiveState;
}

export interface RootState {
  connection: ConnectionState;
  user: UserState;
  lobby: LobbyState;
  shell: ShellState;
  games: GamesState;
}
