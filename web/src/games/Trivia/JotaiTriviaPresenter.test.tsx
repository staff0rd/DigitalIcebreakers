import { screen, act, fireEvent } from "@testing-library/react";
import { JotaiTriviaPresenter } from "./JotaiTriviaPresenter";
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

const createTriviaQuestions = () => [
  createQuestion({
    id: "question-1",
    text: "first question",
    answers: [
      createAnswer({ id: "answer-1", text: "correct", correct: true }),
      createAnswer({ id: "answer-2", text: "wrong" }),
    ],
  }),
  createQuestion({
    id: "question-2",
    text: "second question",
    answers: [
      createAnswer({ id: "answer-3", text: "yes", correct: true }),
      createAnswer({ id: "answer-4", text: "no" }),
    ],
  }),
];

const renderPresenter = ({
  questions = createTriviaQuestions(),
  players = createPlayers(),
} = {}) =>
  renderPollTrivia(<JotaiTriviaPresenter />, {
    triviaPresenter: { questions, currentQuestionId: questions[0]?.id },
    players,
  });

const questionMessage = (question: ReturnType<typeof createQuestion>) => ({
  questionId: question.id,
  answers: question.answers,
  question: question.text,
});

const canAnswerMessage = (canAnswer: boolean) => ({ canAnswer });

describe("Trivia Presenter", () => {
  describe("when questions are loaded", () => {
    it("displays the current question", () => {
      renderPresenter();

      expect(screen.getByText("first question")).toBeInTheDocument();
    });

    it("sends the current question to players without bundling canAnswer", () => {
      const questions = createTriviaQuestions();
      const { sentPresenterMessages } = renderPresenter({ questions });

      expect(sentPresenterMessages()).toContainEqual(
        questionMessage(questions[0])
      );
    });

    it("tells players they can answer", () => {
      const { sentPresenterMessages } = renderPresenter();

      expect(sentPresenterMessages()).toContainEqual(canAnswerMessage(true));
    });

    describe("when advancing to the next question", () => {
      it("displays the next question", () => {
        renderPresenter();

        fireEvent.click(screen.getByTestId("next-question"));

        expect(screen.getByText("second question")).toBeInTheDocument();
      });

      it("sends the next question to players", () => {
        const questions = createTriviaQuestions();
        const { sentPresenterMessages } = renderPresenter({ questions });

        fireEvent.click(screen.getByTestId("next-question"));

        expect(sentPresenterMessages()).toContainEqual(
          questionMessage(questions[1])
        );
      });
    });

    describe("when toggling responses", () => {
      it("shows the response chart", () => {
        renderPresenter();

        fireEvent.click(screen.getByTestId("show-responses"));

        expect(screen.getByTestId("answer-answer-1")).toBeInTheDocument();
      });

      it("tells players they can no longer answer", () => {
        const { sentPresenterMessages } = renderPresenter();

        fireEvent.click(screen.getByTestId("show-responses"));

        expect(sentPresenterMessages()).toContainEqual(canAnswerMessage(false));
      });

      describe("and advancing to a question with a correct answer", () => {
        it("hides the responses again", () => {
          renderPresenter();

          fireEvent.click(screen.getByTestId("show-responses"));
          fireEvent.click(screen.getByTestId("next-question"));

          expect(screen.queryByTestId("answer-answer-3")).not.toBeInTheDocument();
          expect(screen.getByText("second question")).toBeInTheDocument();
        });
      });
    });

    describe("when players have answered", () => {
      const playerAnswers = (
        result: ReturnType<typeof renderPresenter>,
        answers: { playerId: string; playerName: string; answerId: string }[]
      ) =>
        act(() => {
          answers.forEach(({ playerId, playerName, answerId }) =>
            receiveGameMessage(
              result.jotaiStore,
              "trivia",
              {
                id: playerId,
                name: playerName,
                payload: [{ questionId: "question-1", answerId }],
              },
              true
            )
          );
        });

      it("displays the responses in the chart", () => {
        const result = renderPresenter();
        playerAnswers(result, [
          { playerId: "player-1", playerName: "Player 1", answerId: "answer-1" },
          { playerId: "player-2", playerName: "Player 2", answerId: "answer-1" },
        ]);

        fireEvent.click(screen.getByTestId("show-responses"));

        expect(
          screen.getByTestId("answer-answer-1").querySelector(".count")
        ).toHaveTextContent("2");
      });

      describe("when showing the scoreboard", () => {
        const showScoreBoard = () => {
          const result = renderPresenter();
          playerAnswers(result, [
            {
              playerId: "player-1",
              playerName: "Player 1",
              answerId: "answer-1",
            },
            {
              playerId: "player-2",
              playerName: "Player 2",
              answerId: "answer-2",
            },
          ]);
          fireEvent.click(screen.getByTestId("show-scoreboard"));
          return result;
        };

        it("ranks players by correct answers", () => {
          showScoreBoard();

          const names = screen
            .getAllByRole("rowheader")
            .filter((cell) => cell.classList.contains("scoreboard-name"))
            .map((cell) => cell.textContent);
          const scores = screen
            .getAllByRole("rowheader")
            .filter((cell) => cell.classList.contains("scoreboard-score"))
            .map((cell) => cell.textContent);

          expect(names).toEqual(["Player 1", "Player 2"]);
          expect(scores).toEqual(["1", "0"]);
        });

        it("tells players they can no longer answer", () => {
          const { sentPresenterMessages } = showScoreBoard();

          expect(sentPresenterMessages()).toContainEqual(
            canAnswerMessage(false)
          );
        });

        describe("and advancing to the next question", () => {
          it("hides the scoreboard", () => {
            showScoreBoard();

            fireEvent.click(screen.getByTestId("next-question"));

            expect(screen.queryByText("Scores")).not.toBeInTheDocument();
            expect(screen.getByText("second question")).toBeInTheDocument();
          });
        });
      });
    });

    describe("when the presenter leaves the game", () => {
      it("tells players they can no longer answer", () => {
        const { sentPresenterMessages, unmount } = renderPresenter();

        unmount();

        expect(sentPresenterMessages()).toContainEqual(canAnswerMessage(false));
      });
    });
  });
});
