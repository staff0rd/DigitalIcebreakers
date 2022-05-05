import { currentQuestionSelector } from "../../shared/Poll/reducers/currentQuestionSelector";
import { rootReducer } from "../../../store/rootReducer";
import { configureStore } from "@reduxjs/toolkit";
import { presenterActions } from "games/shared/Poll/reducers/presenterActions";
import { Name } from "..";

const twoQuestions = [
  {
    id: "5743c5f0-90c5-184f-800d-7c4f794cdff3",
    answers: [
      {
        id: "4d63ce96-2268-7f28-c960-70db176fc010",
        text: "Question 1 Answer",
        correct: true,
      },
    ],
    responses: [],
    text: "Question 1",
  },
  {
    id: "1a07c811-4e82-5be4-03e1-8fe8abd2198e",
    answers: [
      {
        id: "a4170547-9634-fc63-b333-c2c585f5ce01",
        text: "Question 2 Answer",
        correct: true,
      },
    ],
    responses: [],
    text: "Question 2",
  },
];

const { importQuestionsAction, setCurrentQuestionAction } =
  presenterActions(Name);

describe("pollReducer", () => {
  let store = configureStore({ reducer: rootReducer });

  beforeEach(() => {
    store = configureStore({ reducer: rootReducer });
  });

  describe("import questions", () => {
    it("should reset current question", () => {
      store.dispatch(
        importQuestionsAction([
          { id: "1", text: "a question", responses: [], answers: [] },
        ])
      );
      const currentQuestion = currentQuestionSelector((state) => ({
        currentQuestionId: state.games.poll.presenter.currentQuestionId,
        questions: state.games.poll.presenter.questions,
        showResponses: true,
      }))(store.getState());
      expect(currentQuestion.currentQuestionId).toBe("1");
      expect(currentQuestion.question?.text).toBe("a question");
    });

    it("should clear current question", () => {
      store.dispatch(importQuestionsAction([]));
      const currentQuestion = currentQuestionSelector((state) => ({
        currentQuestionId: state.games.poll.presenter.currentQuestionId,
        questions: state.games.poll.presenter.questions,
        showResponses: true,
      }))(store.getState());
      expect(currentQuestion.currentQuestionId).toBeUndefined();
    });

    it("should show second answer on second question", () => {
      store.dispatch(importQuestionsAction(twoQuestions));
      let currentQuestion = currentQuestionSelector((state) => ({
        currentQuestionId: state.games.poll.presenter.currentQuestionId,
        questions: state.games.poll.presenter.questions,
        showResponses: true,
      }))(store.getState());
      expect(currentQuestion.nextQuestionId).toBe(
        "1a07c811-4e82-5be4-03e1-8fe8abd2198e"
      );
      store.dispatch(setCurrentQuestionAction(currentQuestion.nextQuestionId!));

      currentQuestion = currentQuestionSelector((state) => ({
        currentQuestionId: state.games.poll.presenter.currentQuestionId,
        questions: state.games.poll.presenter.questions,
        showResponses: true,
      }))(store.getState());
      expect(currentQuestion.question?.text).toBe("Question 2");
      expect(currentQuestion.question?.answers[0].text).toBe(
        "Question 2 Answer"
      );
    });
  });
});
