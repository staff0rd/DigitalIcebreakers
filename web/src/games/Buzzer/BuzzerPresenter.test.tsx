import { render, screen, act } from "@testing-library/react";
import { createTheme } from "@mui/material";
import { ThemeProvider } from "@mui/styles";
import { Provider as JotaiProvider, createStore } from "jotai";
import { describe, it, expect } from "vitest";
import BuzzerPresenter from "./BuzzerPresenter";
import { setLobbyGameAtom } from "../../store/jotai/transportAtoms";
import { initializeMockTransport } from "../../store/jotai/transportTestHelpers";
import { lobbyAtom, initialLobbyState } from "../../store/atoms/lobbyAtoms";

const renderPresenter = () => {
  const jotaiStore = createStore();
  const { emit } = initializeMockTransport(jotaiStore);
  jotaiStore.set(lobbyAtom, { ...initialLobbyState, isPresenter: true });
  render(
    <ThemeProvider theme={createTheme({})}>
      <JotaiProvider store={jotaiStore}>
        <BuzzerPresenter />
      </JotaiProvider>
    </ThemeProvider>
  );
  act(() => jotaiStore.set(setLobbyGameAtom, "buzzer"));
  return { emit };
};

describe("BuzzerPresenter", () => {
  describe("when a player buzzes", () => {
    it("shows the player as buzzing", () => {
      const { emit } = renderPresenter();

      emit("gameMessage", { payload: "down", id: "player-1", name: "Alice" });

      expect(screen.getByRole("button", { name: "Alice" })).toHaveClass(
        "Mui-selected"
      );
    });
  });

  describe("when a new buzzer round starts", () => {
    it("clears the previous round's players", () => {
      const { emit } = renderPresenter();
      emit("gameMessage", { payload: "down", id: "player-1", name: "Alice" });

      emit("newgame", "buzzer");

      expect(
        screen.queryByRole("button", { name: "Alice" })
      ).not.toBeInTheDocument();
    });
  });
});
