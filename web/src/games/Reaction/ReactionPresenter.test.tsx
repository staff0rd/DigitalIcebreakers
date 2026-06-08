import { render, screen, act } from "@testing-library/react";
import { createTheme } from "@mui/material";
import { ThemeProvider } from "@mui/styles";
import { Provider as JotaiProvider, createStore } from "jotai";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ReactionPresenter } from "./ReactionPresenter";
import { reactionAtom } from "./atoms";
import { lobbyAtom, initialLobbyState } from "store/atoms/lobbyAtoms";
import { setLobbyGameAtom } from "store/jotai/transportAtoms";
import { initializeMockTransport } from "store/jotai/transportTestHelpers";
import { Player } from "Player";

const renderPresenter = ({ players = [] }: { players?: Player[] } = {}) => {
  const jotaiStore = createStore();
  jotaiStore.set(lobbyAtom, {
    ...initialLobbyState,
    isPresenter: true,
    players,
  });
  const { emit } = initializeMockTransport(jotaiStore);
  const result = render(
    <ThemeProvider theme={createTheme({})}>
      <JotaiProvider store={jotaiStore}>
        <ReactionPresenter />
      </JotaiProvider>
    </ThemeProvider>
  );
  act(() => jotaiStore.set(setLobbyGameAtom, "reaction"));

  const chooseShape = (playerId: string, shapeId: number) =>
    act(() =>
      emit("gameMessage", { id: playerId, name: playerId, payload: shapeId })
    );

  const currentShapeId = () =>
    jotaiStore.get(reactionAtom).presenter.shape!.id;

  const otherShapeId = () =>
    jotaiStore
      .get(reactionAtom)
      .presenter.shapes.find((s) => s.id !== currentShapeId())!.id;

  return { ...result, jotaiStore, chooseShape, currentShapeId, otherShapeId };
};

const presenterShape = (shapeId: number) =>
  screen.getByTestId(`presenter-shape-${shapeId}`);

describe("Reaction Presenter", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("when a player picks the main shape first", () => {
    it("shows that player's name on the shape", () => {
      const { chooseShape, currentShapeId } = renderPresenter({
        players: [
          { id: "p1", name: "Alice" },
          { id: "p2", name: "Bob" },
        ],
      });
      const shapeId = currentShapeId();
      chooseShape("p1", shapeId);
      expect(presenterShape(shapeId)).toHaveAttribute(
        "data-first-player",
        "Alice"
      );
    });
  });

  describe("when a player tries to change their selection", () => {
    it("keeps only their first choice", () => {
      const { chooseShape, currentShapeId, otherShapeId } = renderPresenter({
        players: [{ id: "p1", name: "Alice" }],
      });
      const first = currentShapeId();
      const second = otherShapeId();

      chooseShape("p1", first);
      chooseShape("p1", second);

      expect(presenterShape(first)).toHaveAttribute("data-choice-count", "1");
      expect(presenterShape(second)).toHaveAttribute("data-choice-count", "0");
    });
  });

  describe("when two players pick the same shape", () => {
    it("credits the first to arrive and counts both", () => {
      const { chooseShape, currentShapeId } = renderPresenter({
        players: [
          { id: "p1", name: "Alice" },
          { id: "p2", name: "Bob" },
        ],
      });
      const shapeId = currentShapeId();

      chooseShape("p2", shapeId);
      chooseShape("p1", shapeId);

      expect(presenterShape(shapeId)).toHaveAttribute(
        "data-first-player",
        "Bob"
      );
      expect(presenterShape(shapeId)).toHaveAttribute("data-choice-count", "2");
    });
  });

  describe("when the round ends", () => {
    it("shows a score row for every player in the lobby", () => {
      renderPresenter({
        players: [
          { id: "p1", name: "Alice" },
          { id: "p2", name: "Bob" },
        ],
      });
      act(() => {
        vi.advanceTimersByTime(2000);
      });
      expect(screen.getByText("Scores")).toBeInTheDocument();
      expect(screen.getByText("Alice")).toBeInTheDocument();
      expect(screen.getByText("Bob")).toBeInTheDocument();
    });
  });
});
