import {
  SET_USER,
  UserActionTypes,
  SET_USER_NAME,
  SET_DESIRED_LOBBY_ID,
  SET_IS_JOINING,
} from "./types";
import { Player } from "../../Player";

export function setUser(user: Player): UserActionTypes {
  return { type: SET_USER, user };
}

export function setUserName(name: string): UserActionTypes {
  return { type: SET_USER_NAME, name };
}

export function setDesiredLobbyId(id: string | undefined): UserActionTypes {
  return { type: SET_DESIRED_LOBBY_ID, id };
}

export function setIsJoining(isJoining: boolean): UserActionTypes {
  return { type: SET_IS_JOINING, isJoining };
}
