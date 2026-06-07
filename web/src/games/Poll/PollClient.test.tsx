import { screen, act, fireEvent } from "@testing-library/react";
import PollClient from "./PollClient";
import {
  receiveGameMessage,
  renderPollTrivia,
} from "../shared/Poll/pollTriviaTestHelpers";

beforeEach(() => {
  window.localStorage.clear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

const availableAnswers = () => ({
  questionId: "question-1",
  question: "favourite colour?",
  answers: [
    { id: "answer-1", text: "red" },
    { id: "answer-2", text: "blue" },
  ],
});

describe("Poll Client", () => {
  describe("when a question arrives", () => {
    const renderWithQuestion = () => {
      const result = renderPollTrivia(<PollClient />);
      act(() => {
        receiveGameMessage(result.jotaiStore, "poll", availableAnswers(), false);
      });
      return result;
    };

    it("shows the question", () => {
      renderWithQuestion();

      expect(screen.getByText("favourite colour?")).toBeInTheDocument();
    });

    it("shows a button for each answer", () => {
      renderWithQuestion();

      ["red", "blue"].forEach((name) =>
        expect(screen.getByRole("button", { name })).toBeInTheDocument()
      );
    });

    it("ignores lock in before an answer is selected", () => {
      const { sentClientMessages } = renderWithQuestion();

      fireEvent.click(screen.getByRole("button", { name: "Lock In & Send" }));

      expect(sentClientMessages()).toHaveLength(0);
    });

    describe("and the player locks in an answer", () => {
      const lockInAnswer = () => {
        const result = renderWithQuestion();
        fireEvent.click(screen.getByRole("button", { name: "blue" }));
        fireEvent.click(screen.getByRole("button", { name: "Lock In & Send" }));
        return result;
      };

      it("sends the answer to the presenter", () => {
        const { sentClientMessages } = lockInAnswer();

        expect(sentClientMessages()).toContainEqual({
          questionId: "question-1",
          answerId: "answer-2",
        });
      });

      it("prevents changing the answer", () => {
        lockInAnswer();

        ["red", "blue"].forEach((name) =>
          expect(screen.getByRole("button", { name })).toHaveAttribute(
            "aria-disabled",
            "true"
          )
        );
      });

      describe("and the same question is broadcast again", () => {
        it("keeps the answer locked", () => {
          const result = lockInAnswer();

          act(() => {
            receiveGameMessage(
              result.jotaiStore,
              "poll",
              availableAnswers(),
              false
            );
          });

          ["red", "blue"].forEach((name) =>
            expect(screen.getByRole("button", { name })).toHaveAttribute(
              "aria-disabled",
              "true"
            )
          );
        });
      });

      describe("and a different question is broadcast", () => {
        it("lets the player answer again", () => {
          const result = lockInAnswer();

          act(() => {
            receiveGameMessage(
              result.jotaiStore,
              "poll",
              {
                questionId: "question-2",
                question: "favourite shape?",
                answers: [{ id: "answer-3", text: "circle" }],
              },
              false
            );
          });

          expect(
            screen.getByRole("button", { name: "circle" })
          ).not.toHaveAttribute("aria-disabled", "true");
        });
      });
    });
  });

  describe("when a question arrives", () => {
    it("presents the answers in a shuffled order", () => {
      vi.spyOn(Math, "random").mockReturnValue(0);
      const result = renderPollTrivia(<PollClient />);

      act(() => {
        receiveGameMessage(result.jotaiStore, "poll", availableAnswers(), false);
      });

      const answers = [
        ...result.container.querySelectorAll(".answer"),
      ].map((answer) => answer.textContent);
      expect(answers).toEqual(["blue", "red"]);
    });
  });
});
