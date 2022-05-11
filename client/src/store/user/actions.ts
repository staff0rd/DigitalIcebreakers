import { createAction } from "@reduxjs/toolkit";
import { Player } from "@src/Player";
import { SET_USER, UserActionTypes, SET_USER_NAME } from "./types";

export function setUser(user: Player): UserActionTypes {
  return { type: SET_USER, user };
}

export function setUserName(name: string): UserActionTypes {
  return { type: SET_USER_NAME, name };
}

export const authenticate = createAction("AUTHENTICATE");
