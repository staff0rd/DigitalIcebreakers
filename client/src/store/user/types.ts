import { Player } from "@src/Player";

export interface UserState {
  name?: string;
  id: string;
  isRegistered: boolean;
}

export const SET_USER = "SET_USER";
export const SET_USER_NAME = "SET_NAME";
interface SetUserAction {
  type: typeof SET_USER;
  user: Player;
}

interface SetNameAction {
  type: typeof SET_USER_NAME;
  name: string;
}

export type UserActionTypes = SetUserAction | SetNameAction;
