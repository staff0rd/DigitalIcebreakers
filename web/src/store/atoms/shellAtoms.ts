import { atom } from "jotai";

export const showDrawerAtom = atom(false);

export const toggleDrawerAtom = atom(null, (get, set, show?: boolean) => {
  set(showDrawerAtom, show === undefined ? !get(showDrawerAtom) : show);
});
