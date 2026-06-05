import { UserActionTypes, SET_USER_NAME } from "./types";

export function setUserName(name: string): UserActionTypes {
  return { type: SET_USER_NAME, name };
}
