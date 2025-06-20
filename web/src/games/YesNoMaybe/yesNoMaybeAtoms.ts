import { atom } from "jotai";

export interface YesNoMaybeState {
  yes: number;
  no: number;
  maybe: number;
}

export const yesNoMaybeAtom = atom<YesNoMaybeState>({
  yes: 0,
  no: 0,
  maybe: 0,
});