import { SelectableAnswer } from "../types/PlayerState";
import { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { playerActions } from "./playerActions";

export const playerActionReducer = (gameName: string) => (
  builder: ActionReducerMapBuilder<SelectableAnswer>
): void => {
  const { selectAnswerAction, lockAnswerAction } = playerActions(gameName);

  builder.addCase(
    selectAnswerAction,
    (state, { payload: selectedAnswerId }) => ({
      ...state,
      selectedAnswerId,
    })
  );
  builder.addCase(lockAnswerAction, (state) => ({
    ...state,
    answerLocked: true,
  }));
};
