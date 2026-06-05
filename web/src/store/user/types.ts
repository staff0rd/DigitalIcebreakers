export interface UserState {
  name: string;
  id: string;
  isRegistered: boolean;
}

export const SET_USER_NAME = "SET_NAME";

interface SetNameAction {
  type: typeof SET_USER_NAME;
  name: string;
}

export type UserActionTypes = SetNameAction;
