import { Player } from "@src/Player";
import {
  SET_USER,
  UserActionTypes,
  SET_USER_NAME,
  AUTHENTICATE,
} from "./types";

export function setUser(user: Player): UserActionTypes {
  return { type: SET_USER, user };
}

export function setUserName(name: string): UserActionTypes {
  return { type: SET_USER_NAME, name };
}

export function authenticate(): UserActionTypes {
  return { type: AUTHENTICATE };
}
