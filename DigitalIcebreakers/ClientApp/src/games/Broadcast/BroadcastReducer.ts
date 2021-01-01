import { combineReducers } from "redux";
import {
  createGameActionWithPayload,
  createReceiveReducer,
} from "store/actionHelpers";

export const Name = "broadcast";

export const setTextAction = createGameActionWithPayload<string>(
  Name,
  "presenter",
  "set-text"
);

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
  BroadcastClientState,
  string
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

const broadcastPresenterReducer = createReceiveReducer<
  BroadcastPresenterState,
  string
>(
  Name,
  { dings: 0, text: "" },
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
  }
);

export const broadcastReducer = combineReducers<BroadcastState>({
  client: broadcastClientReducer,
  presenter: broadcastPresenterReducer,
});
