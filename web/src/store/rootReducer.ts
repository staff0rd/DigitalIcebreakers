import { RootState } from "./RootState";

// All state lives in Jotai atoms now; redux remains only to route
// middleware command actions (removed entirely in a later phase).
export const rootReducer = (state: RootState = {}): RootState => state;
