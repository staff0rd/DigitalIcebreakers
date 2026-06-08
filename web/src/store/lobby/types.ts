import { Player } from "../../Player";

export interface LobbyState {
  id?: string;
  name?: string;
  isPresenter: boolean;
  players: Player[];
  currentGame: string | undefined;
  joiningLobbyId?: string;
}
