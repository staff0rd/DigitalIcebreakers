import { ConnectionState } from "./connection/types";
import { UserState } from "./user/types";
import { LobbyState } from "./lobby/types";
import { ShellState } from "./shell/types";
import { Player } from "../games/Buzzer/BuzzerReducer";
import { SplatState } from "../games/Splat/SplatReducer";
import { PongClientState, PongPresenterState } from "../games/Pong/PongReducer";
import { IdeaWallState } from "../games/IdeaWall/IdeaWallReducer";
import { FistOfFiveState, PollState } from "../games/shared/Poll/types/State";
import { TriviaState } from "games/shared/Poll/types/State";
import { NamePickerState } from "../games/NamePicker/NamePickerReducer";
import { ReactionState } from "games/Reaction/reactionReducer";
import { RetrospectiveState } from "games/Retrospective/reducer";

export interface GamesState {
  doggosVsKittehs: { yes: number; no: number; maybe: number };
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
  reaction: ReactionState;
  retrospective: RetrospectiveState;
  fistOfFive: FistOfFiveState;
}

export interface RootState {
  connection: ConnectionState;
  user: UserState;
  lobby: LobbyState;
  shell: ShellState;
  games: GamesState;
}
