import { screen, act, fireEvent } from "@testing-library/react";
import { Presenter } from "./Presenter";
import {
  createCategories,
  createIdeaMessage,
  receiveGameMessage,
  renderRetrospective,
} from "./retrospectiveTestHelpers";

beforeEach(() => {
  window.localStorage.clear();
});

describe("Retrospective Presenter", () => {
  describe("when no categories are set", () => {
    it("prompts the presenter to set categories", () => {
      renderRetrospective(<Presenter />);

      expect(
        screen.getByRole("heading", { name: "Set categories" })
      ).toBeInTheDocument();
    });
  });

  describe("when the presenter selects the Start/Stop/Continue preset", () => {
    const selectPreset = () => {
      const result = renderRetrospective(<Presenter />);
      fireEvent.click(screen.getAllByRole("button", { name: "Select" })[0]);
      return result;
    };

    it("shows each category waiting for ideas", () => {
      selectPreset();

      ["Start", "Stop", "Continue"].forEach((name) =>
        expect(screen.getByRole("heading", { name })).toBeInTheDocument()
      );
      expect(screen.getAllByText("Waiting for audience...")).toHaveLength(3);
    });

    it("sends the categories to participants", () => {
      const { sentPresenterMessages } = selectPreset();

      expect(sentPresenterMessages()).toContainEqual(createCategories());
    });
  });

  describe("when the presenter enters custom categories", () => {
    const setCustomCategories = (value: string) => {
      const result = renderRetrospective(<Presenter />);
      const input = result.container.querySelector("#custom-categories");
      fireEvent.change(input!, { target: { value } });
      fireEvent.click(screen.getByTestId("select-custom"));
      return result;
    };

    it("shows a category per line", () => {
      setCustomCategories("one\ntwo");

      expect(screen.getByRole("heading", { name: "one" })).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: "two" })).toBeInTheDocument();
    });

    it("shows an error when no categories are entered", () => {
      setCustomCategories("  \n ");

      expect(
        screen.getByText("Specify at least one category")
      ).toBeInTheDocument();
    });
  });

  describe("when categories are set", () => {
    describe("and a participant submits an idea", () => {
      it("shows the idea under its category", () => {
        const { jotaiStore } = renderRetrospective(<Presenter />, {
          presenter: { categories: createCategories() },
        });

        act(() => {
          receiveGameMessage(
            jotaiStore,
            createIdeaMessage({ category: 1, message: "stop doing this" }),
            true
          );
        });

        const idea = screen.getByText("stop doing this");
        const stopHeading = screen.getByRole("heading", { name: "Stop" });
        const continueHeading = screen.getByRole("heading", {
          name: "Continue",
        });
        expect(
          stopHeading.compareDocumentPosition(idea) &
            Node.DOCUMENT_POSITION_FOLLOWING
        ).toBeTruthy();
        expect(
          continueHeading.compareDocumentPosition(idea) &
            Node.DOCUMENT_POSITION_PRECEDING
        ).toBeTruthy();
        expect(screen.getAllByText("Waiting for audience...")).toHaveLength(2);
      });
    });
  });

  describe("when a previous session was saved", () => {
    it("restores categories and ideas from storage", () => {
      window.localStorage.setItem(
        "retrospective",
        JSON.stringify({
          ideas: [createIdeaMessage({ category: 0, message: "saved idea" })],
          categories: createCategories(),
        })
      );

      renderRetrospective(<Presenter />);

      expect(
        screen.getByRole("heading", { name: "Start" })
      ).toBeInTheDocument();
      expect(screen.getByText("saved idea")).toBeInTheDocument();
    });
  });
});
