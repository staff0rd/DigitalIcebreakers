import { LobbyState } from "./lobby/types";
import { ShellState } from "./shell/types";

export interface RootState {
  lobby: LobbyState;
  shell: ShellState;
}
