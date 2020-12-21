import {
  UserState,
  UserActionTypes,
  SET_USER,
  SET_USER_NAME,
  SET_DESIRED_LOBBY_ID,
  SET_IS_JOINING,
} from "./types";

const initialState: UserState = {
  id: "",
  name: "",
  isRegistered: false,
  isJoining: false,
  desiredLobbyId: undefined,
};

export function userReducer(
  state = initialState,
  action: UserActionTypes
): UserState {
  switch (action.type) {
    case SET_USER_NAME: {
      return {
        ...state,
        name: action.name,
        isRegistered: true,
      };
    }
    case SET_USER: {
      return {
        ...state,
        id: action.user.id,
        name: action.user.name,
      };
    }
    case SET_DESIRED_LOBBY_ID: {
      return {
        ...state,
        desiredLobbyId: action.id,
      };
    }
    case SET_IS_JOINING: {
      return {
        ...state,
        isJoining: action.isJoining,
      };
    }
    default:
      return state;
  }
}
