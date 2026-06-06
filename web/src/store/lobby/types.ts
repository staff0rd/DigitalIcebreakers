import { Player } from "../../Player";

export interface LobbyState {
  id?: string;
  name?: string;
  isPresenter: boolean;
  players: Player[];
  currentGame: string | undefined;
  joiningLobbyId?: string;
}

export const SET_LOBBY_GAME = "SET_LOBBY_GAME";
export const CLEAR_LOBBY = "CLEAR_LOBBY";
export const CLOSE_LOBBY = "CLOSE_LOBBY";
export const START_NEW_GAME = "START_NEW_GAME";
export const JOIN_LOBBY = "JOIN_LOBBY";
export const CREATE_LOBBY = "CREATE_LOBBY";
export const GAME_MESSAGE_PRESENTER = "GAME_MESSAGE_PRESENTER";
export const GAME_MESSAGE_CLIENT = "GAME_MESSAGE_CLIENT";

interface ClearLobbyAction {
  type: typeof CLEAR_LOBBY;
}

interface CloseLobbyAction {
  type: typeof CLOSE_LOBBY;
}

interface SetLobbyGame {
  type: typeof SET_LOBBY_GAME;
  game: string;
}

interface StartNewGameAction {
  type: typeof START_NEW_GAME;
  name: string;
}

interface JoinLobbyAction {
  type: typeof JOIN_LOBBY;
  id: string;
}

interface CreateLobbyAction {
  type: typeof CREATE_LOBBY;
  name: string;
}

interface GameMessagePresenterAction {
  type: typeof GAME_MESSAGE_PRESENTER;
  message: any;
}

interface GameMessageClientAction {
  type: typeof GAME_MESSAGE_CLIENT;
  message: any;
}

export type LobbyActionTypes =
  | SetLobbyGame
  | ClearLobbyAction
  | CloseLobbyAction
  | StartNewGameAction
  | JoinLobbyAction
  | CreateLobbyAction
  | GameMessagePresenterAction
  | GameMessageClientAction;
