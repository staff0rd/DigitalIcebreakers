import { Player } from "../../Player";

export interface UserState {
  name: string;
  id: string;
  isRegistered: boolean;
  joinLobyId: string | undefined;
  isJoining: boolean;
}

export const SET_USER = "SET_USER";
export const SET_USER_NAME = "SET_NAME";
export const SET_DESIRED_LOBBY_ID = "SET_DESIRED_LOBBY_ID";
export const SET_IS_JOINING = "SET_IS_JOINING";

interface SetUserAction {
  type: typeof SET_USER;
  user: Player;
}

interface SetNameAction {
  type: typeof SET_USER_NAME;
  name: string;
}

interface SetDesiredLobbyId {
  type: typeof SET_DESIRED_LOBBY_ID;
  id: string | undefined;
}

interface SetIsJoining {
  type: typeof SET_IS_JOINING;
  isJoining: boolean;
}

export type UserActionTypes =
  | SetUserAction
  | SetNameAction
  | SetDesiredLobbyId
  | SetIsJoining;
