import { ConnectionState } from "./connection/types";
import { UserState } from "./user/types";
import { LobbyState } from "./lobby/types";
import { ShellState } from "./shell/types";
import { PongClientState, PongPresenterState } from "../games/Pong/PongReducer";
import { IdeaWallState } from "../games/IdeaWall/IdeaWallReducer";
import { PollState } from "../games/shared/Poll/types/State";
import { TriviaState } from "games/shared/Poll/types/State";
import { ReactionState } from "games/Reaction/reactionReducer";
import { RetrospectiveState } from "games/Retrospective/reducer";

export interface GamesState {
  pong: {
    client: PongClientState;
    presenter: PongPresenterState;
  };
  ideawall: IdeaWallState;
  poll: PollState;
  trivia: TriviaState;
  reaction: ReactionState;
  retrospective: RetrospectiveState;
}

export interface RootState {
  connection: ConnectionState;
  user: UserState;
  lobby: LobbyState;
  shell: ShellState;
  games: GamesState;
}
