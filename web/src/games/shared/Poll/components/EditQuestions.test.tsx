import { act, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router";
import EditQuestions from "./EditQuestions";
import EditQuestion from "./EditQuestion";
import { Name as PollName } from "games/Poll";
import { Name as TriviaName } from "games/Trivia";
import {
  createAnswer,
  createQuestion,
  renderPollTrivia,
} from "../pollTriviaTestHelpers";

beforeEach(() => {
  window.localStorage.clear();
});

const createQuestions = () => [
  createQuestion({
    id: "question-1",
    text: "first question",
    answers: [createAnswer({ id: "answer-1", text: "red" })],
  }),
  createQuestion({
    id: "question-2",
    text: "second question",
    answers: [createAnswer({ id: "answer-2", text: "blue" })],
  }),
];

const renderQuestionEditor = ({
  gameName = TriviaName,
  questions = createQuestions(),
  initialEntry = "/questions",
} = {}) =>
  renderPollTrivia(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/questions" element={<EditQuestions />} />
        <Route path="/questions/:id" element={<EditQuestion />} />
      </Routes>
    </MemoryRouter>,
    {
      currentGame: gameName,
      ...(gameName === PollName
        ? { pollPresenter: { questions } }
        : { triviaPresenter: { questions } }),
    }
  );

describe("Editing questions", () => {
  describe.each([
    { mode: "Trivia", gameName: TriviaName },
    { mode: "Poll", gameName: PollName },
  ])("when the current game is $mode", ({ gameName }) => {
    it("shows the updated text in the questions table after saving an edited question", () => {
      renderQuestionEditor({
        gameName,
        initialEntry: "/questions/question-1",
      });

      fireEvent.change(screen.getByLabelText("Question text"), {
        target: { value: "an updated question" },
      });
      fireEvent.click(screen.getByRole("button", { name: "Save" }));

      expect(screen.getByText("an updated question")).toBeInTheDocument();
      expect(screen.queryByText("first question")).not.toBeInTheDocument();
    });

    it("removes the question from the table after deleting it", () => {
      renderQuestionEditor({
        gameName,
        initialEntry: "/questions/question-1",
      });

      fireEvent.click(screen.getByRole("button", { name: "Delete" }));

      expect(screen.queryByText("first question")).not.toBeInTheDocument();
      expect(screen.getByText("second question")).toBeInTheDocument();
    });
  });

  describe("when applying a bulk edit in Trivia", () => {
    it("replaces the questions table with the bulk-edited questions", () => {
      renderQuestionEditor();

      fireEvent.click(screen.getByRole("button", { name: "Bulk edit" }));
      fireEvent.change(screen.getByLabelText("Questions & answers"), {
        target: { value: "- a bulk question\n* right\nwrong" },
      });
      fireEvent.click(screen.getByRole("button", { name: "Ok" }));

      expect(screen.getByText("a bulk question")).toBeInTheDocument();
      expect(screen.queryByText("first question")).not.toBeInTheDocument();
    });
  });

  describe("when generating auto questions in Trivia", () => {
    it("replaces the questions table with the fetched questions", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          json: () =>
            Promise.resolve({
              response_code: 0,
              results: [
                {
                  category: "General",
                  correct_answer: "42",
                  difficulty: "easy",
                  incorrect_answers: ["41", "43"],
                  question: "an auto question",
                  type: "multiple",
                },
              ],
            }),
        })
      );

      renderQuestionEditor();

      fireEvent.click(screen.getByRole("button", { name: "Auto questions" }));
      // act flushes the async fetch/import chain triggered by the click
      await act(async () => {
        fireEvent.click(screen.getByRole("button", { name: "Ok" }));
      });

      expect(screen.getByText("an auto question")).toBeInTheDocument();
      expect(screen.queryByText("first question")).not.toBeInTheDocument();

      vi.unstubAllGlobals();
    });
  });
});
