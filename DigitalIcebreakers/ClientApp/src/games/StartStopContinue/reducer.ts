import { GameMessage } from "games/GameMessage";
import {
  createGameAction,
  createReceiveGameMessageReducer,
} from "store/actionHelpers";
import { PlayerPayload } from "./Player";

export const Name = "start-stop-continue";

export interface StartStopContinueState {
  ideas: GameMessage<PlayerPayload>[];
}

export const clearIdeasAction = createGameAction(
  Name,
  "presenter",
  "clear-ideas"
);

export const startStopContinueReducer = createReceiveGameMessageReducer<
  PlayerPayload,
  StartStopContinueState
>(
  Name,
  { ideas: [] },
  (state, action) => {
    const result = {
      ideas: [...state.ideas, action.payload],
    };
    console.log("Received: ", action, "Returning: ", result);
    return result;
  },
  "presenter",
  (builder) => builder.addCase(clearIdeasAction, (state) => ({ ideas: [] }))
);
