import {
  createGameAction,
  createReceiveGameMessageReducer,
} from "../../store/actionHelpers";

export const Name = "namepicker";

export interface NamePickerState {
  shouldPick: boolean;
}

export const reset = createGameAction(Name, "presenter", "reset");
export const pick = createGameAction(Name, "presenter", "pick");

export const namePickerReducer = createReceiveGameMessageReducer<
  string,
  NamePickerState
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
