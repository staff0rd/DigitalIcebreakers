import { combineReducers } from "redux";
import {
  createGameAction,
  createReceiveGameMessageReducer,
  createReceiveReducer,
} from "../../store/actionHelpers";

export const Name = "namepicker";

interface NamePickerPresenterState {
  shouldPick: boolean;
}

export const reset = createGameAction(Name, "presenter", "reset");
export const pick = createGameAction(Name, "presenter", "pick");

export const namePickerPresenterReducer = createReceiveGameMessageReducer<
  string,
  NamePickerPresenterState
>(
  Name,
  { shouldPick: false },
  (state) => state,
  "presenter",
  (builder) => {
    builder.addCase(reset, () => ({ shouldPick: false }));
    builder.addCase(pick, () => ({ shouldPick: true }));
  }
);

export interface NamePickerState {
  presenter: NamePickerPresenterState;
  player: NamePickerPlayerState;
}

interface NamePickerPlayerState {
  selectedId: string | undefined;
}

export const namePickerPlayerReducer = createReceiveReducer<
  string,
  NamePickerPlayerState
>(
  Name,
  { selectedId: undefined },
  (_, action) => ({ selectedId: action.payload }),
  "client"
);

export const namePickerReducer = combineReducers<NamePickerState>({
  player: namePickerPlayerReducer,
  presenter: namePickerPresenterReducer,
});
