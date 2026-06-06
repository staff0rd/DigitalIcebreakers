import { render, screen } from "@testing-library/react";
import { Provider as JotaiProvider, createStore } from "jotai";
import { describe, it, expect } from "vitest";
import { Game } from "./Game";
import { lobbyAtom, initialLobbyState } from "../store/atoms/lobbyAtoms";
import { LobbyState } from "../store/lobby/types";

const renderGame = (lobby?: Partial<LobbyState>) => {
  const jotaiStore = createStore();
  jotaiStore.set(lobbyAtom, { ...initialLobbyState, ...lobby });
  return render(
    <JotaiProvider store={jotaiStore}>
      <Game />
    </JotaiProvider>
  );
};

describe("Game", () => {
  describe("with no current game", () => {
    it("renders the no-game fallback", () => {
      renderGame({ currentGame: "" });
      expect(screen.getByText("No game")).toBeInTheDocument();
    });
  });

  describe("with an unknown current game", () => {
    it("renders the no-game fallback", () => {
      renderGame({ currentGame: "not-a-real-game" });
      expect(screen.getByText("No game")).toBeInTheDocument();
    });

    describe("as presenter", () => {
      it("renders the no-game fallback", () => {
        renderGame({ currentGame: "not-a-real-game", isPresenter: true });
        expect(screen.getByText("No game")).toBeInTheDocument();
      });
    });
  });
});
