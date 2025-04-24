import { createReceiveReducer } from "store/actionHelpers";
import { Name } from "./presenterReducer";
import { Category } from "./presenterReducer";

export type RetrospectiveParticipantState = {
  categories: Category[];
};

export type PayloadFromPresenter = {
  categories: Category[];
};

export const participantReducer = createReceiveReducer<
  PayloadFromPresenter,
  RetrospectiveParticipantState
>(
  Name,
  { categories: [] },
  (_, action) => {
    const result = {
      categories: [...action.payload.categories],
    };
    console.log("Received: ", action, "Returning: ", result);
    return result;
  },
  "client"
);
