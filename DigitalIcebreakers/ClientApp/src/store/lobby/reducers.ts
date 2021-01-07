import {
  LobbyState,
  LobbyActionTypes,
  SET_LOBBY,
  SET_LOBBY_GAME,
  SET_LOBBY_PLAYERS,
  CLEAR_LOBBY,
  JOIN_LOBBY,
  PLAYER_JOINED_LOBBY,
  PLAYER_LEFT_LOBBY,
  CREATE_LOBBY,
} from "./types";

const initialState: LobbyState = {
  isPresenter: false,
  players: [],
  currentGame: "",
};

export function lobbyReducer(
  state = initialState,
  action: LobbyActionTypes
): LobbyState {
  switch (action.type) {
    case SET_LOBBY: {
      return {
        id: action.id,
        name: action.name,
        isPresenter: action.isPresenter,
        currentGame: action.game,
        players: action.players,
      };
    }
    case CREATE_LOBBY: {
      return {
        ...state,
        isPresenter: true,
        name: action.name,
      };
    }
    case JOIN_LOBBY: {
      return {
        ...state,
        joiningLobbyId: action.id,
      };
    }
    case PLAYER_JOINED_LOBBY: {
      return {
        ...state,
        players: [...state.players, action.player],
      };
    }
    case PLAYER_LEFT_LOBBY: {
      return {
        ...state,
        players: state.players.filter((p) => p.id !== action.player.id),
      };
    }
    case SET_LOBBY_PLAYERS: {
      return {
        ...state,
        players: action.players,
      };
    }
    case SET_LOBBY_GAME: {
      return {
        ...state,
        currentGame: action.game,
      };
    }
    case CLEAR_LOBBY: {
      return initialState;
    }
    default:
      return state;
  }
}
