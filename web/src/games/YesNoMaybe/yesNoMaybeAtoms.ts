import { atom } from "jotai";
import {
  registerGame,
  GameMessageHandler,
} from "../../store/jotai/gameMessageHandlers";

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

// Message handler for yes-no-maybe game
const yesNoMaybeMessageHandler: GameMessageHandler<YesNoMaybeState> = (
  currentState,
  message
) => {
  // Extract the payload from the wrapped message
  return message.payload as YesNoMaybeState;
};

// Register the game with its handler
registerGame("yes-no-maybe", yesNoMaybeAtom, yesNoMaybeMessageHandler);
