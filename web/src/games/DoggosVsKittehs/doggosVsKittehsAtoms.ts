import { atom } from "jotai";
import {
  registerGame,
  GameMessageHandler,
} from "../../store/jotai/gameMessageHandlers";

export interface DoggosVsKittehsState {
  yes: number;
  no: number;
  maybe: number;
}

interface ServerState {
  doggos: number;
  kittehs: number;
  undecided: number;
}

export const doggosVsKittehsAtom = atom<DoggosVsKittehsState>({
  yes: 0,
  no: 0,
  maybe: 0,
});

// Message handler for doggos-vs-kittehs game
const doggosVsKittehsMessageHandler: GameMessageHandler<DoggosVsKittehsState> = (
  currentState,
  message
) => {
  // Extract the payload from the wrapped message
  const serverState = message.payload as ServerState;
  return {
    yes: serverState.doggos,
    no: serverState.kittehs,
    maybe: serverState.undecided,
  };
};

// Register the game with its handler
registerGame("doggos-vs-kittehs", doggosVsKittehsAtom, doggosVsKittehsMessageHandler);