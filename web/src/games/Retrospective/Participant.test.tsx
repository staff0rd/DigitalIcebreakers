import { screen, act, fireEvent } from "@testing-library/react";
import { Participant } from "./Participant";
import {
  createCategories,
  receiveGameMessage,
  renderRetrospective,
} from "./retrospectiveTestHelpers";

beforeEach(() => {
  window.localStorage.clear();
});

describe("Retrospective Participant", () => {
  describe("when categories have been received from the presenter", () => {
    const renderWithCategories = () => {
      const result = renderRetrospective(<Participant />);
      act(() => {
        receiveGameMessage(
          result.jotaiStore,
          { categories: createCategories() },
          false
        );
      });
      return result;
    };

    it("shows a button for each category", () => {
      renderWithCategories();

      ["Start", "Stop", "Continue"].forEach((name) =>
        expect(screen.getByRole("button", { name })).toBeInTheDocument()
      );
    });

    describe("and the player submits an idea", () => {
      const submitIdea = (idea: string, category: string) => {
        const result = renderWithCategories();
        const input = result.container.querySelector("#idea-value");
        fireEvent.change(input!, { target: { value: idea } });
        fireEvent.click(screen.getByRole("button", { name: category }));
        return { ...result, input };
      };

      it("sends the idea to the chosen category", () => {
        const { sentClientMessages } = submitIdea("do more pairing", "Stop");

        expect(sentClientMessages()).toContainEqual({
          category: 1,
          message: "do more pairing",
        });
      });

      it("clears the idea input", () => {
        const { input } = submitIdea("do more pairing", "Start");

        expect(input).toHaveValue("");
      });
    });

    describe("and the idea is empty", () => {
      it("does not send anything", () => {
        const { sentClientMessages } = renderWithCategories();

        fireEvent.click(screen.getByRole("button", { name: "Start" }));

        expect(sentClientMessages()).toHaveLength(0);
      });
    });
  });
});
