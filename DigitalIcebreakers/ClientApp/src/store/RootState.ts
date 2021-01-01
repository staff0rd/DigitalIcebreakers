import { ConnectionState } from "./connection/types";
import { UserState } from "./user/types";
import { LobbyState } from "./lobby/types";
import { ShellState } from "./shell/types";
import { YesNoMaybeState } from "../games/YesNoMaybe/YesNoMaybeReducer";
import { Player } from "../games/Buzzer/BuzzerReducer";
import { SplatState } from "../games/Splat/SplatReducer";
import { PongClientState, PongPresenterState } from "../games/Pong/PongReducer";
import { IdeaWallState } from "../games/IdeaWall/IdeaWallReducer";
import { PollState } from "../games/Poll/types/PollState";
import { NamePickerState } from "../games/NamePicker/NamePickerReducer";
import { BroadcastState } from "games/Broadcast/BroadcastReducer";

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
  namePicker: NamePickerState;
  broadcast: BroadcastState;
}

export interface RootState {
  connection: ConnectionState;
  user: UserState;
  lobby: LobbyState;
  shell: ShellState;
  games: GamesState;
}
