import { combineReducers } from "redux";
import {
  createGameActionWithPayload,
  createReceiveGameMessageReducer,
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

const broadcastClientReducer = createReceiveGameMessageReducer<
  string,
  BroadcastClientState
>(
  Name,
  { text: "" },
  (_, { payload: { payload: result } }) => {
    return {
      text: result,
    };
  },
  "client"
);

const broadcastPresenterReducer = createReceiveGameMessageReducer<
  string,
  BroadcastPresenterState
>(
  Name,
  { dings: 0, text: "" },
  (state, _) => ({
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
