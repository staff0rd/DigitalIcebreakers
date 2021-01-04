import { Question } from "games/shared/Poll/types/Question";
import { RootState } from "store/RootState";
import { createSelector } from "@reduxjs/toolkit";
import { Answer } from "games/shared/Poll/types/Answer";

export interface GameState<T extends Answer> {
  currentQuestionId: string | undefined;
  questions: Question<T>[];
}

export const currentQuestionSelector = <T extends Answer>(
  gameStateSelector: (state: RootState) => GameState<T>
) =>
  createSelector(
    (state: RootState) => gameStateSelector(state),
    (state) => {
      const question = state.questions.find(
        (q) => q.id === (state.currentQuestionId || "")
      );
      const currentQuestionId = state.currentQuestionId;
      const totalQuestions = state.questions.length;
      const responseCount = question?.responses?.length || 0;
      const questionIds = state.questions.map((q) => q.id);
      const currentQuestionIndex = currentQuestionId
        ? questionIds.indexOf(currentQuestionId)
        : -1;
      const currentQuestionNumber = currentQuestionIndex + 1;
      const previousQuestionId =
        currentQuestionIndex > 0 ? questionIds[currentQuestionIndex - 1] : null;
      const nextQuestionId =
        currentQuestionIndex !== -1 &&
        currentQuestionIndex < questionIds.length + 1
          ? questionIds[currentQuestionIndex + 1]
          : null;
      return {
        currentQuestionId,
        question,
        questionIds,
        responseCount,
        previousQuestionId,
        nextQuestionId,
        currentQuestionNumber,
        totalQuestions,
      };
    }
  );
