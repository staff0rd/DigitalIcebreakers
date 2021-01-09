import { combineReducers } from "redux";
import {
  createGameAction,
  createGameActionWithPayload,
  createReceiveReducer,
} from "store/actionHelpers";

export const Name = "broadcast";

export const setTextAction = createGameActionWithPayload<string>(
  Name,
  "presenter",
  "set-text"
);

export const resetAction = createGameAction(Name, "presenter", "reset");

type BroadcastClientState = {
  text: string;
};

type BroadcastPresenterState = {
  text: string;
  dings: number;
};

export type BroadcastState = {
  client: BroadcastClientState;
  presenter: BroadcastPresenterState;
};

const broadcastClientReducer = createReceiveReducer<
  string,
  BroadcastClientState
>(
  Name,
  { text: "" },
  (_, action) => {
    return {
      text: action.payload,
    };
  },
  "client"
);

const initialPresenterState = { dings: 0, text: "" };

const broadcastPresenterReducer = createReceiveReducer<
  string,
  BroadcastPresenterState
>(
  Name,
  initialPresenterState,
  (state) => ({
    ...state,
    dings: state.dings + 1,
  }),
  "presenter",
  (builder) => {
    builder.addCase(setTextAction, (state, action) => ({
      ...state,
      text: action.payload,
    }));
    builder.addCase(resetAction, (state) => initialPresenterState);
  }
);

export const broadcastReducer = combineReducers<BroadcastState>({
  client: broadcastClientReducer,
  presenter: broadcastPresenterReducer,
});
