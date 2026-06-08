import { screen, act, fireEvent } from "@testing-library/react";
import { JotaiPollPresenter } from "./JotaiPollPresenter";
import {
  createAnswer,
  createPlayers,
  createQuestion,
  receiveGameMessage,
  renderPollTrivia,
} from "../shared/Poll/pollTriviaTestHelpers";

beforeEach(() => {
  window.localStorage.clear();
});

const createPollQuestions = () => [
  createQuestion({
    id: "question-1",
    text: "first question",
    answers: [
      createAnswer({ id: "answer-1", text: "red" }),
      createAnswer({ id: "answer-2", text: "blue" }),
    ],
  }),
  createQuestion({
    id: "question-2",
    text: "second question",
    answers: [createAnswer({ id: "answer-3", text: "yes" })],
  }),
];

const renderPresenter = ({ questions = createPollQuestions() } = {}) =>
  renderPollTrivia(<JotaiPollPresenter />, {
    pollPresenter: { questions, currentQuestionId: questions[0]?.id },
    players: createPlayers(),
  });

describe("Poll Presenter", () => {
  describe("when questions are loaded", () => {
    it("displays the current question", () => {
      renderPresenter();

      expect(screen.getByText("first question")).toBeInTheDocument();
    });

    it("sends the current question to players", () => {
      const questions = createPollQuestions();
      const { sentPresenterMessages } = renderPresenter({ questions });

      expect(sentPresenterMessages()).toContainEqual({
        questionId: "question-1",
        answers: questions[0].answers,
        question: "first question",
      });
    });

    describe("when a player has answered and responses are shown", () => {
      it("displays the response in the chart", () => {
        const result = renderPresenter();
        act(() => {
          receiveGameMessage(
            result.jotaiStore,
            "poll",
            {
              id: "player-1",
              name: "Player 1",
              payload: [{ questionId: "question-1", answerId: "answer-1" }],
            },
            true
          );
        });

        fireEvent.click(screen.getByTestId("show-responses"));

        expect(
          screen.getByTestId("answer-answer-1").querySelector(".count")
        ).toHaveTextContent("1");
      });
    });

    describe("when a player's answer arrives as a single response", () => {
      it("displays the response in the chart", () => {
        const result = renderPresenter();
        act(() => {
          receiveGameMessage(
            result.jotaiStore,
            "poll",
            {
              id: "player-1",
              name: "Player 1",
              payload: { questionId: "question-1", answerId: "answer-1" },
            },
            true
          );
        });

        fireEvent.click(screen.getByTestId("show-responses"));

        expect(
          screen.getByTestId("answer-answer-1").querySelector(".count")
        ).toHaveTextContent("1");
      });
    });

    describe("when a new poll starts", () => {
      it("clears responses but keeps the questions", () => {
        const result = renderPresenter();
        act(() => {
          receiveGameMessage(
            result.jotaiStore,
            "poll",
            {
              id: "player-1",
              name: "Player 1",
              payload: { questionId: "question-1", answerId: "answer-1" },
            },
            true
          );
        });

        result.emit("newgame", "poll");

        expect(screen.getByText("first question")).toBeInTheDocument();
        expect(
          screen.getByText("0 of 2 participants have responded")
        ).toBeInTheDocument();
      });
    });

    describe("when advancing to the next question", () => {
      it("displays the next question", () => {
        renderPresenter();

        fireEvent.click(screen.getByTestId("next-question"));

        expect(screen.getByText("second question")).toBeInTheDocument();
      });

      it("sends the next question to players", () => {
        const questions = createPollQuestions();
        const { sentPresenterMessages } = renderPresenter({ questions });

        fireEvent.click(screen.getByTestId("next-question"));

        expect(sentPresenterMessages()).toContainEqual({
          questionId: "question-2",
          answers: questions[1].answers,
          question: "second question",
        });
      });

      it("shows the responses for the next question", () => {
        renderPresenter();

        fireEvent.click(screen.getByTestId("next-question"));

        expect(screen.getByTestId("answer-answer-3")).toBeInTheDocument();
      });
    });
  });
});
