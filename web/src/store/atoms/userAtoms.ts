import { atom } from "jotai";
import { UserState } from "../user/types";

export const userAtom = atom<UserState>({
  id: "",
  name: "",
  isRegistered: false,
});
