import {
  createGameActionWithPayload,
  createGameAction,
} from "@store/actionHelpers";

export const playerActions = (gameName: string) => {
  const selectAnswerAction = createGameActionWithPayload<string>(
    gameName,
    "client",
    "select-answer"
  );
  const lockAnswerAction = createGameAction(gameName, "client", "lock-answer");

  return {
    selectAnswerAction,
    lockAnswerAction,
  };
};
