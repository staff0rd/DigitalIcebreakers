import {
  LobbyActionTypes,
  SET_LOBBY_GAME,
  CLEAR_LOBBY,
  START_NEW_GAME,
  JOIN_LOBBY,
  CLOSE_LOBBY,
  CREATE_LOBBY,
  GAME_MESSAGE_PRESENTER,
  GAME_MESSAGE_CLIENT,
} from "./types";

export function setLobbyGame(game: string): LobbyActionTypes {
  return { type: SET_LOBBY_GAME, game };
}

export function clearLobby(): LobbyActionTypes {
  return { type: CLEAR_LOBBY };
}

export function startNewGame(name: string): LobbyActionTypes {
  return { type: START_NEW_GAME, name };
}

export function joinLobby(id: string): LobbyActionTypes {
  return { type: JOIN_LOBBY, id };
}

export function closeLobby(): LobbyActionTypes {
  return { type: CLOSE_LOBBY };
}

export function createLobby(name: string): LobbyActionTypes {
  return { type: CREATE_LOBBY, name };
}

export function presenterMessage(message: any): LobbyActionTypes {
  return { type: GAME_MESSAGE_PRESENTER, message };
}

export function clientMessage(message: any): LobbyActionTypes {
  return { type: GAME_MESSAGE_CLIENT, message };
}
