import { atom } from "jotai";
import {
  registerGame,
  GameMessageHandler,
} from "../../store/jotai/gameMessageHandlers";
import { lobbyAtom } from "../../store/atoms/lobbyAtoms";

// 0 = yes, 1 = no
export type YesNoMaybeVote = "0" | "1";

export interface YesNoMaybeState {
  votes: Record<string, YesNoMaybeVote>;
}

export const yesNoMaybeAtom = atom<YesNoMaybeState>({ votes: {} });

export const yesNoMaybeResultsAtom = atom((get) => {
  const votes = Object.values(get(yesNoMaybeAtom).votes);
  const yes = votes.filter((vote) => vote === "0").length;
  const no = votes.filter((vote) => vote === "1").length;
  const maybe = Math.max(get(lobbyAtom).players.length - yes - no, 0);
  return { yes, no, maybe };
});

export const resetVotesAtom = atom(null, (_get, set) => {
  set(yesNoMaybeAtom, { votes: {} });
});

const yesNoMaybeMessageHandler: GameMessageHandler<YesNoMaybeState> = (
  currentState,
  message,
  isPresenter
) => {
  if (!isPresenter) {
    return currentState;
  }
  const { payload, id } = message ?? {};
  if ((payload === "0" || payload === "1") && id) {
    return { votes: { ...currentState.votes, [id]: payload } };
  }
  return currentState;
};

registerGame("yes-no-maybe", yesNoMaybeAtom, yesNoMaybeMessageHandler, {
  resetState: () => ({ votes: {} }),
});
