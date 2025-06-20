import { atom } from "jotai";
import { registerGame, GameMessageHandler } from "../../store/jotai/gameMessageHandlers";

export interface NamePickerPresenterState {
  shouldPick: boolean;
}

export interface NamePickerPlayerState {
  selectedId: string | undefined;
}

export interface NamePickerState {
  presenter: NamePickerPresenterState;
  player: NamePickerPlayerState;
}

export const namePickerAtom = atom<NamePickerState>({
  presenter: {
    shouldPick: false,
  },
  player: {
    selectedId: undefined,
  },
});

// Message handler for namepicker game
const namePickerMessageHandler: GameMessageHandler<NamePickerState> = (
  currentState,
  message,
  isPresenter
) => {
  if (isPresenter) {
    // Presenter doesn't receive game messages in this game
    return currentState;
  } else {
    // Client receives the selected player ID
    return {
      ...currentState,
      player: {
        selectedId: message,
      },
    };
  }
};

// Register the game with its handler
registerGame("name-picker", namePickerAtom, namePickerMessageHandler);