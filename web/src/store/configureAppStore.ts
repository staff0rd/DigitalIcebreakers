import { AnyAction, configureStore, Dispatch } from "@reduxjs/toolkit";
import { rootReducer } from "./rootReducer";

// Redux now holds no state and no middleware; SignalR routing lives in
// store/jotai/signalRAtoms. This file is deleted entirely in the next phase.
export function configureAppStore() {
  const store = configureStore({
    reducer: rootReducer,
  });
  return store;
}

export type AppDispatch = Dispatch<AnyAction>;
