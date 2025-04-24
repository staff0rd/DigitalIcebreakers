import { Question } from "../types/Question";
import { guid } from "../../../../util/guid";
import { PresenterState } from "../types/PresenterState";
import { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { presenterActions } from "games/shared/Poll/reducers/presenterActions";
import StorageManager from "store/StorageManager";

const storage = new StorageManager(window.localStorage);
export type ShouldShowResponses = <S extends PresenterState>(
  state: S,
  newQuestion: Question | undefined
) => boolean;

export const presenterActionReducers = (
  gameName: string,
  storageKey: string
) => <T extends PresenterState>(
  builder: ActionReducerMapBuilder<T>,
  shouldShowResponses: ShouldShowResponses
) => {
  const {
    toggleShowResponsesAction,
    clearResponsesAction,
    addQuestionAction,
    updateQuestionAction,
    deleteQuestionAction,
    importQuestionsAction,
    setCurrentQuestionAction,
  } = presenterActions(gameName);

  builder.addCase(addQuestionAction, (state, action) => {
    const questions = [
      ...state.questions,
      {
        id: action.payload,
        isVisible: true,
        order: state.questions.length,
        responses: [],
        text: "Change this text to your question",
        answers: [
          {
            id: guid(),
            text: "An answer",
            correct: false,
          },
        ],
      },
    ];
    storage.saveToStorage(storageKey, questions);
    const currentQuestionId = state.questions.length
      ? state.currentQuestionId
      : action.payload; // TODO: Why? This is being done because the currentQuestionSelector is not being recalculated unless save is hit
    return {
      currentQuestionId,
      ...state,
      questions,
    } as T;
  });
  builder.addCase(updateQuestionAction, (state, { payload: question }) => {
    const questions = state.questions.map((q) =>
      q.id !== question.id ? q : question
    );
    storage.saveToStorage(storageKey, questions);
    return {
      ...state,
      questions,
    } as T;
  });
  builder.addCase(deleteQuestionAction, (state, { payload: question }) => {
    const questions = state.questions.filter((q) => q.id !== question.id);
    storage.saveToStorage(storageKey, questions);
    return {
      ...state,
      questions,
    } as T;
  });
  builder.addCase(importQuestionsAction, (state, { payload: questions }) => {
    storage.saveToStorage(storageKey, questions);
    let currentQuestionId: string | undefined;
    if (questions.length) {
      currentQuestionId = questions[0].id;
    }
    return {
      ...state,
      questions,
      currentQuestionId,
    } as T;
  });
  builder.addCase(
    setCurrentQuestionAction,
    (state, { payload: currentQuestionId }) => {
      const newQuestion = state.questions.find(
        (q) => q.id === currentQuestionId
      );
      const showResponses = shouldShowResponses(state, newQuestion);
      return {
        ...state,
        showScoreBoard: false,
        showResponses,
        currentQuestionId,
      } as T;
    }
  );

  builder.addCase(
    toggleShowResponsesAction,
    (state: PresenterState) =>
      ({
        ...state,
        showResponses: !state.showResponses,
      } as T)
  );

  builder.addCase(
    clearResponsesAction,
    (state) =>
      ({
        ...state,
        questions: state.questions.map((q) => ({
          ...q,
          responses: [],
        })),
      } as T)
  );
};
