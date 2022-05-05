import {
  createGameAction,
  createGameActionWithPayload,
} from "@store/actionHelpers";
import { Question } from "../types/Question";

export const presenterActions = (gameName: string) => {
  const toggleShowResponsesAction = createGameAction(
    gameName,
    "presenter",
    "toggle-show-responses"
  );
  const clearResponsesAction = createGameAction(
    gameName,
    "presenter",
    "clear-responses"
  );
  const addQuestionAction = createGameActionWithPayload<string>(
    gameName,
    "presenter",
    "add-question"
  );
  const updateQuestionAction = createGameActionWithPayload<Question>(
    gameName,
    "presenter",
    "update-question"
  );
  const deleteQuestionAction = createGameActionWithPayload<Question>(
    gameName,
    "presenter",
    "delete-question"
  );
  const importQuestionsAction = createGameActionWithPayload<Question[]>(
    gameName,
    "presenter",
    "import-questions"
  );
  const setCurrentQuestionAction = createGameActionWithPayload<string>(
    gameName,
    "presenter",
    "set-current-question"
  );
  return {
    toggleShowResponsesAction,
    clearResponsesAction,
    addQuestionAction,
    updateQuestionAction,
    deleteQuestionAction,
    importQuestionsAction,
    setCurrentQuestionAction,
  };
};
