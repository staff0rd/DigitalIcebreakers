import { Player } from "Player";

export type ReconnectPayload = {
  playerId: string;
  playerName: string;
  lobbyId: string;
  lobbyName: string;
  isPresenter: boolean;
  players: Player[];
  currentGame: string;
  isRegistered: boolean;
  presenterState?: unknown;
  playerState?: unknown;
};
