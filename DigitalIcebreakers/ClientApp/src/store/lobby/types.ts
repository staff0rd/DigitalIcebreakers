import { Player } from "../../Player"

export interface LobbyState {
    id?: string;
    name?: string;
    isAdmin: boolean;
    players: Player[];
    currentGame: string | undefined;
}

export const SET_LOBBY = 'SET_LOBBY';
export const SET_LOBBY_PLAYERS = 'SET_LOBBY_PLAYERS';
export const SET_LOBBY_GAME = 'SET_LOBBY_GAME';
export const CLEAR_LOBBY = 'CLEAR_LOBBY';
export const CLOSE_LOBBY = 'CLOSE_LOBBY';
export const PLAYER_JOINED_LOBBY = 'PLAYER_JOINED_LOBBY';
export const PLAYER_LEFT_LOBBY = 'PLAYER_LEFT_LOBBY';
export const START_NEW_GAME = 'START_NEW_GAME';
export const JOIN_LOBBY = 'JOIN_LOBBY';
export const CREATE_LOBBY = 'CREATE_LOBBY';
export const GAME_MESSAGE_ADMIN = 'GAME_MESSAGE_ADMIN';
export const GAME_MESSAGE_CLIENT = 'GAME_MESSAGE_CLIENT';

interface SetLobbyAction {
    type: typeof SET_LOBBY;
    id: string;
    name: string;
    isAdmin: boolean;
    players: Player[];
    game: string | undefined;
}

interface ClearLobbyAction {
    type: typeof CLEAR_LOBBY;
}

interface CloseLobbyAction {
    type: typeof CLOSE_LOBBY;
}

interface SetLobbyPlayers {
    type: typeof SET_LOBBY_PLAYERS;
    players: Player[];
}

interface SetLobbyGame {
    type: typeof SET_LOBBY_GAME;
    game: string;
}

interface PlayerJoinedLobbyAction {
    type: typeof PLAYER_JOINED_LOBBY;
    player: Player;
}

interface PlayerLeftLobbyAction {
    type: typeof PLAYER_LEFT_LOBBY;
    player: Player;
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

interface GameMessageAdminAction {
    type: typeof GAME_MESSAGE_ADMIN;
    message: any;
}

interface GameMessageClientAction {
    type: typeof GAME_MESSAGE_CLIENT;
    message: any;
}
  
export type LobbyActionTypes = SetLobbyAction | SetLobbyPlayers | SetLobbyGame | ClearLobbyAction | CloseLobbyAction | PlayerJoinedLobbyAction | PlayerLeftLobbyAction | StartNewGameAction | JoinLobbyAction | CreateLobbyAction | GameMessageAdminAction | GameMessageClientAction;
