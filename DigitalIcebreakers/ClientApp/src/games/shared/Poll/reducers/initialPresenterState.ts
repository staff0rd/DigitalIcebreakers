import { Question } from "../types/Question";
import StorageManager from "store/StorageManager";
import { Answer } from "games/shared/Poll/types/Answer";

const storage = new StorageManager(window.localStorage);
export const initialPresenterState = <T extends Answer>(
  storageKey: string
) => ({
  questions: (storage.getFromStorage(storageKey) || []) as Question<T>[],
  currentQuestionId: undefined,
  showResponses: false,
});
