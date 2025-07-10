import { ConnectionState } from "./connection/types";
import { UserState } from "./user/types";
import { LobbyState } from "./lobby/types";
import { ShellState } from "./shell/types";
import { PollState } from "../games/shared/Poll/types/State";
import { TriviaState } from "games/shared/Poll/types/State";
import { RetrospectiveState } from "games/Retrospective/reducer";

export interface GamesState {
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
