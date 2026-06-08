import { atom } from "jotai";
import {
  registerGame,
  GameMessageHandler,
} from "../../store/jotai/gameMessageHandlers";
import { lobbyAtom } from "../../store/atoms/lobbyAtoms";

// 0 = doggos, 1 = kittehs
export type DoggosVsKittehsVote = "0" | "1";

export interface DoggosVsKittehsState {
  votes: Record<string, DoggosVsKittehsVote>;
}

export const doggosVsKittehsAtom = atom<DoggosVsKittehsState>({ votes: {} });

export const doggosVsKittehsResultsAtom = atom((get) => {
  const votes = Object.values(get(doggosVsKittehsAtom).votes);
  const doggos = votes.filter((vote) => vote === "0").length;
  const kittehs = votes.filter((vote) => vote === "1").length;
  const undecided = Math.max(
    get(lobbyAtom).players.length - doggos - kittehs,
    0
  );
  return { doggos, kittehs, undecided };
});

const doggosVsKittehsMessageHandler: GameMessageHandler<
  DoggosVsKittehsState
> = (currentState, message, isPresenter) => {
  if (!isPresenter) {
    return currentState;
  }
  const { payload, id } = message ?? {};
  if ((payload === "0" || payload === "1") && id) {
    return { votes: { ...currentState.votes, [id]: payload } };
  }
  return currentState;
};

registerGame(
  "doggos-vs-kittehs",
  doggosVsKittehsAtom,
  doggosVsKittehsMessageHandler,
  { resetState: () => ({ votes: {} }) }
);
