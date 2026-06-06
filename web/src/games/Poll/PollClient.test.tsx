import { screen, act, fireEvent } from "@testing-library/react";
import PollClient from "./PollClient";
import {
  receiveGameMessage,
  renderPollTrivia,
} from "../shared/Poll/pollTriviaTestHelpers";

beforeEach(() => {
  window.localStorage.clear();
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
    });
  });
});
