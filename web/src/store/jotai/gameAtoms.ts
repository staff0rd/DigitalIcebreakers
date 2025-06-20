import { WritableAtom } from "jotai";
import { yesNoMaybeAtom } from "../../games/YesNoMaybe/yesNoMaybeAtoms";

type GameAtomRegistry = {
  [gameName: string]: WritableAtom<unknown, [unknown], void>;
};

export const gameAtomRegistry: GameAtomRegistry = {
  "yes-no-maybe": yesNoMaybeAtom,
};

export const isGameMigratedToJotai = (gameName: string): boolean => {
  return gameName in gameAtomRegistry;
};

export const getGameAtom = (gameName: string) => {
  return gameAtomRegistry[gameName];
};