import {
    LobbyState,
    LobbyActionTypes,
    SET_LOBBY,
    SET_LOBBY_GAME,
    SET_LOBBY_PLAYERS,
    CLEAR_LOBBY,
    PLAYER_JOINED_LOBBY,
    PLAYER_LEFT_LOBBY
} from './types'

const initialState: LobbyState = {
    isAdmin: false,
    players: [],
    currentGame: ""
}

export function lobbyReducer(
    state = initialState,
    action: LobbyActionTypes
): LobbyState {
    switch (action.type) {
        case SET_LOBBY: {
            return {
                ...state,
                id: action.id,
                name: action.name,
                isAdmin: action.isAdmin,
                currentGame: action.game
            };
        }
        case PLAYER_JOINED_LOBBY: {
            return {
                ...state,
                players: [...state.players, action.player]
            }
        }
        case PLAYER_LEFT_LOBBY: {
            return {
                ...state,
                players: state.players.filter(p => p.id !== action.player.id)
            }
        }
        case SET_LOBBY_PLAYERS: {
            return {
                ...state,
                players: action.players
            };
        }
        case SET_LOBBY_GAME: {
            return {
                ...state,
                currentGame: action.game
            };
        }
        case CLEAR_LOBBY: {
            return initialState;
        }
        default:
            return state
    }
}