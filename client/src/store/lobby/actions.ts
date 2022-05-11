import {
  LobbyActionTypes,
  SET_LOBBY,
  SET_LOBBY_PLAYERS,
  SET_LOBBY_GAME,
  CLEAR_LOBBY,
  PLAYER_JOINED_LOBBY,
  PLAYER_LEFT_LOBBY,
  START_NEW_GAME,
  JOIN_LOBBY,
  CLOSE_LOBBY,
  GAME_MESSAGE_PRESENTER,
  GAME_MESSAGE_CLIENT,
} from "./types";
import { Player } from "../../Player";
import { range, sample } from "lodash";
import { createAction } from "@reduxjs/toolkit";

export function setLobby(
  id: string,
  name: string,
  isPresenter: boolean,
  players: Player[],
  game?: string
): LobbyActionTypes {
  return { type: SET_LOBBY, id, name, isPresenter, players, game };
}

export function setLobbyPlayers(players: Player[]): LobbyActionTypes {
  return { type: SET_LOBBY_PLAYERS, players };
}

export function setLobbyGame(game: string): LobbyActionTypes {
  return { type: SET_LOBBY_GAME, game };
}

export function clearLobby(): LobbyActionTypes {
  return { type: CLEAR_LOBBY };
}

export function playerJoinedLobby(player: Player): LobbyActionTypes {
  return { type: PLAYER_JOINED_LOBBY, player };
}

export function playerLeftLobby(player: Player): LobbyActionTypes {
  return { type: PLAYER_LEFT_LOBBY, player };
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

const getRandomString = (length: number) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return range(0, length)
    .map((p) => sample(chars))
    .join("");
};

export const createLobby = createAction("CREATE_LOBBY", (name: string) => {
  const id = getRandomString(4);
  return { payload: { name, id } };
});

type t = ReturnType<typeof createLobby>;

export function presenterMessage(message: any): LobbyActionTypes {
  return { type: GAME_MESSAGE_PRESENTER, message };
}

export function clientMessage(message: any): LobbyActionTypes {
  return { type: GAME_MESSAGE_CLIENT, message };
}
