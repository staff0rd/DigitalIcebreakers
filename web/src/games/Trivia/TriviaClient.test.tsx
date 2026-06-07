import { screen, act, fireEvent } from "@testing-library/react";
import TriviaClient from "./TriviaClient";
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
  question: "first question",
  answers: [
    { id: "answer-1", text: "correct", correct: true },
    { id: "answer-2", text: "wrong" },
  ],
});

const renderClient = () => renderPollTrivia(<TriviaClient />);

const receive = (
  result: ReturnType<typeof renderClient>,
  ...messages: unknown[]
) =>
  act(() => {
    messages.forEach((message) =>
      receiveGameMessage(result.jotaiStore, "trivia", message, false)
    );
  });

describe("Trivia Client", () => {
  it("asks the player to wait before a question arrives", () => {
    renderClient();

    expect(screen.getByText("Please wait...")).toBeInTheDocument();
  });

  describe("when answering is open and a question arrives", () => {
    const renderWithQuestion = () => {
      const result = renderClient();
      receive(result, { canAnswer: true }, availableAnswers());
      return result;
    };

    it("shows the question", () => {
      renderWithQuestion();

      expect(screen.getByText("first question")).toBeInTheDocument();
    });

    it("shows a button for each answer", () => {
      renderWithQuestion();

      ["correct", "wrong"].forEach((name) =>
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
        fireEvent.click(screen.getByRole("button", { name: "correct" }));
        fireEvent.click(screen.getByRole("button", { name: "Lock In & Send" }));
        return result;
      };

      it("sends the answer to the presenter", () => {
        const { sentClientMessages } = lockInAnswer();

        expect(sentClientMessages()).toContainEqual({
          questionId: "question-1",
          answerId: "answer-1",
        });
      });

      it("prevents changing the answer", () => {
        lockInAnswer();

        ["correct", "wrong"].forEach((name) =>
          expect(screen.getByRole("button", { name })).toHaveAttribute(
            "aria-disabled",
            "true"
          )
        );
      });

      describe("and the same question is broadcast again", () => {
        it("keeps the answer locked", () => {
          const result = lockInAnswer();

          receive(result, availableAnswers());

          ["correct", "wrong"].forEach((name) =>
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

          receive(result, {
            questionId: "question-2",
            question: "second question",
            answers: [{ id: "answer-3", text: "yes" }],
          });

          expect(
            screen.getByRole("button", { name: "yes" })
          ).not.toHaveAttribute("aria-disabled", "true");
        });
      });
    });

    it("presents the answers in a shuffled order", () => {
      vi.spyOn(Math, "random").mockReturnValue(0);
      const result = renderClient();

      receive(result, { canAnswer: true }, availableAnswers());

      const answers = [
        ...result.container.querySelectorAll(".answer"),
      ].map((answer) => answer.textContent);
      expect(answers).toEqual(["wrong", "correct"]);
    });
  });

  describe("when answering is closed", () => {
    it("asks the player to wait even after a question arrives", () => {
      const result = renderClient();

      receive(result, availableAnswers());

      expect(screen.getByText("Please wait...")).toBeInTheDocument();
    });

    it("asks the player to wait when the presenter closes answering", () => {
      const result = renderClient();

      receive(
        result,
        { canAnswer: true },
        availableAnswers(),
        { canAnswer: false }
      );

      expect(screen.getByText("Please wait...")).toBeInTheDocument();
    });

    it("still shows the question to a player who locked in an answer", () => {
      const result = renderClient();
      receive(result, { canAnswer: true }, availableAnswers());
      fireEvent.click(screen.getByRole("button", { name: "correct" }));
      fireEvent.click(screen.getByRole("button", { name: "Lock In & Send" }));

      receive(result, { canAnswer: false });

      expect(screen.getByText("first question")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "correct" })).toHaveAttribute(
        "aria-disabled",
        "true"
      );
    });
  });
});
