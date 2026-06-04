import { screen, fireEvent } from "@testing-library/react";
import { Menu } from "./Menu";
import { Presenter } from "./Presenter";
import {
  createCategories,
  createIdeaMessage,
  renderRetrospective,
} from "./retrospectiveTestHelpers";

beforeEach(() => {
  window.localStorage.clear();
});

describe("Retrospective Menu", () => {
  const renderMenuWithIdeas = () =>
    renderRetrospective(
      <>
        <Menu />
        <Presenter />
      </>,
      {
        presenter: {
          categories: createCategories(),
          ideas: [createIdeaMessage({ message: "an old idea" })],
        },
      }
    );

  describe("when the presenter clears ideas", () => {
    it("removes all ideas", () => {
      renderMenuWithIdeas();
      expect(screen.getByText("an old idea")).toBeInTheDocument();

      fireEvent.click(screen.getByRole("button", { name: "Clear" }));
      fireEvent.click(screen.getByRole("button", { name: "Ok" }));

      expect(screen.queryByText("an old idea")).not.toBeInTheDocument();
      expect(screen.getAllByText("Waiting for audience...")).toHaveLength(3);
    });
  });

  describe("when the presenter resets categories", () => {
    it("returns to category selection", () => {
      renderMenuWithIdeas();

      fireEvent.click(screen.getByRole("button", { name: "Set categories" }));
      fireEvent.click(screen.getByRole("button", { name: "Ok" }));

      // hidden: true because the exiting confirm dialog still aria-hides the page
      expect(
        screen.getByRole("heading", { name: "Set categories", hidden: true })
      ).toBeInTheDocument();
    });
  });
});
