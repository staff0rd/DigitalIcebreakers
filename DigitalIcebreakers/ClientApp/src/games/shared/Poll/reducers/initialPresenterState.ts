import { Question } from "../types/Question";
import StorageManager from "@store/StorageManager";

const storage = new StorageManager(window.localStorage);
export const initialPresenterState = (storageKey: string) => ({
  questions: (storage.getFromStorage(storageKey) || []) as Question[],
  currentQuestionId: undefined,
  showResponses: false,
});
