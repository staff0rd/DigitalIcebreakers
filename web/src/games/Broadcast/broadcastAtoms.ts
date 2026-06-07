import { atom } from "jotai";
import { registerGame, GameMessageHandler } from "../../store/jotai/gameMessageHandlers";

export interface BroadcastClientState {
  text: string;
}

export interface BroadcastPresenterState {
  text: string;
  dings: number;
}

export interface BroadcastState {
  client: BroadcastClientState;
  presenter: BroadcastPresenterState;
}

export const broadcastAtom = atom<BroadcastState>({
  client: {
    text: "",
  },
  presenter: {
    text: "",
    dings: 0,
  },
});

// Message handler for broadcast game
const broadcastMessageHandler: GameMessageHandler<BroadcastState> = (
  currentState,
  message,
  isPresenter
) => {
  if (isPresenter) {
    // Presenter receives "ding" notifications
    return {
      ...currentState,
      presenter: {
        ...currentState.presenter,
        dings: currentState.presenter.dings + 1,
      },
    };
  } else {
    // Client receives text updates
    return {
      ...currentState,
      client: {
        text: message,
      },
    };
  }
};

// Register the game with its handler
registerGame("broadcast", broadcastAtom, broadcastMessageHandler, {
  resetState: () => ({
    client: { text: "" },
    presenter: { text: "", dings: 0 },
  }),
});