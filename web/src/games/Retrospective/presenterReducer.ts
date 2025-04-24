import { GameMessage } from "games/GameMessage";
import {
  createGameAction,
  createGameActionWithPayload,
  createReceiveGameMessageReducer,
} from "store/actionHelpers";
import { PayloadFromParticipant } from "./Participant";
import StorageManager from "store/StorageManager";
const storage = new StorageManager(window.localStorage);
const storageKey = "retrospective";

export const Name = "retrospective";

export type Category = {
  id: number;
  name: string;
};

export interface RetrospectivePresenterState {
  ideas: GameMessage<PayloadFromParticipant>[];
  categories: Category[];
}

export const clearIdeasAction = createGameAction(
  Name,
  "presenter",
  "clear-ideas"
);

export const setCategories = createGameActionWithPayload<Category[]>(
  Name,
  "presenter",
  "set-categories"
);

export const loadFromStore = createGameAction(Name, "presenter", "load");

export const presenterReducer = createReceiveGameMessageReducer<
  PayloadFromParticipant,
  RetrospectivePresenterState
>(
  Name,
  { ideas: [], categories: [] },
  (state, action) => {
    const result = {
      ...state,
      ideas: [...state.ideas, action.payload],
    };
    storage.saveToStorage(storageKey, result);
    return result;
  },
  "presenter",
  (builder) => {
    builder.addCase(clearIdeasAction, (state) => {
      const result = { ...state, ideas: [] };
      storage.saveToStorage(storageKey, result);
      return result;
    });
    builder.addCase(setCategories, (state, action) => {
      const result = {
        ideas: [],
        categories: [...action.payload],
      };
      storage.saveToStorage(storageKey, result);
      return result;
    });
    builder.addCase(
      loadFromStore,
      (state) =>
        storage.getFromStorage<RetrospectivePresenterState>(storageKey) || {
          ...state,
        }
    );
  }
);
