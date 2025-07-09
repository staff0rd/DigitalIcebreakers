import { ConnectionState } from "./connection/types";
import { UserState } from "./user/types";
import { LobbyState } from "./lobby/types";
import { ShellState } from "./shell/types";
import { IdeaWallState } from "../games/IdeaWall/IdeaWallReducer";
import { PollState } from "../games/shared/Poll/types/State";
import { TriviaState } from "games/shared/Poll/types/State";
import { RetrospectiveState } from "games/Retrospective/reducer";

export interface GamesState {
  ideawall: IdeaWallState;
  poll: PollState;
  trivia: TriviaState;
  retrospective: RetrospectiveState;
}

export interface RootState {
  connection: ConnectionState;
  user: UserState;
  lobby: LobbyState;
  shell: ShellState;
  games: GamesState;
}
