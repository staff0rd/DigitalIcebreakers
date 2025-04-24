import { combineReducers } from "@reduxjs/toolkit";
import {
  presenterReducer,
  RetrospectivePresenterState,
} from "./presenterReducer";
import {
  participantReducer,
  RetrospectiveParticipantState,
} from "./participantReducer";

export type RetrospectiveState = {
  participant: RetrospectiveParticipantState;
  presenter: RetrospectivePresenterState;
};

export const retrospectiveReducer = combineReducers({
  participant: participantReducer,
  presenter: presenterReducer,
});
