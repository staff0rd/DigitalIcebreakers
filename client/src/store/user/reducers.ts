import { UserState, UserActionTypes, SET_USER, SET_USER_NAME } from "./types";

const initialState: UserState = {
  id: "",
  name: "",
  isRegistered: false,
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
        ...action.user,
      };
    }
    default:
      return state;
  }
}
