import { render, screen, act } from "@testing-library/react";
import { createTheme } from "@mui/material";
import { ThemeProvider } from "@mui/styles";
import { Provider as JotaiProvider, createStore } from "jotai";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ReactionPresenter } from "./ReactionPresenter";
import { reactionAtom, reactionMessageHandler } from "./atoms";
import { lobbyAtom, initialLobbyState } from "store/atoms/lobbyAtoms";
import { initializeMockTransport } from "store/jotai/transportTestHelpers";
import { Player } from "Player";

const renderPresenter = ({ players = [] }: { players?: Player[] } = {}) => {
  const jotaiStore = createStore();
  jotaiStore.set(lobbyAtom, { ...initialLobbyState, players });
  initializeMockTransport(jotaiStore);
  const result = render(
    <ThemeProvider theme={createTheme({})}>
      <JotaiProvider store={jotaiStore}>
        <ReactionPresenter />
      </JotaiProvider>
    </ThemeProvider>
  );

  const chooseShape = (playerId: string, shapeId: number) =>
    act(() => {
      jotaiStore.set(
        reactionAtom,
        reactionMessageHandler(
          jotaiStore.get(reactionAtom),
          { id: playerId, payload: { selectedId: shapeId } },
          true
        )
      );
    });

  const currentShapeId = () =>
    jotaiStore.get(reactionAtom).presenter.shape!.id;

  return { ...result, jotaiStore, chooseShape, currentShapeId };
};

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
      expect(
        screen.getByTestId(`presenter-shape-${shapeId}`)
      ).toHaveAttribute("data-first-player", "Alice");
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
