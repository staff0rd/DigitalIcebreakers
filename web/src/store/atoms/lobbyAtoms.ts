import { atom } from "jotai";
import { Player } from "../../Player";
import { LobbyState } from "../lobby/types";

export const initialLobbyState: LobbyState = {
  isPresenter: false,
  players: [],
  currentGame: "",
};

export const lobbyAtom = atom<LobbyState>(initialLobbyState);

export const playerJoinedAtom = atom(null, (get, set, player: Player) => {
  const lobby = get(lobbyAtom);
  set(lobbyAtom, {
    ...lobby,
    players: [...lobby.players.filter((p) => p.id !== player.id), player],
  });
});

export const playerLeftAtom = atom(null, (get, set, player: Player) => {
  const lobby = get(lobbyAtom);
  set(lobbyAtom, {
    ...lobby,
    players: lobby.players.filter((p) => p.id !== player.id),
  });
});
