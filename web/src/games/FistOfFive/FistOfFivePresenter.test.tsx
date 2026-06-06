import { render, screen } from "@testing-library/react";
import { createTheme } from "@mui/material";
import { ThemeProvider } from "@mui/styles";
import { Provider as JotaiProvider, createStore } from "jotai";
import { describe, it, expect } from "vitest";
import FistOfFivePresenter from "./FistOfFivePresenter";
import { lobbyAtom, initialLobbyState } from "store/atoms/lobbyAtoms";
import { initializeMockSignalR } from "store/jotai/signalRTestHelpers";
import { Player } from "Player";

const createPlayers = (count: number): Player[] =>
  Array.from({ length: count }, (_, ix) => ({
    id: `player-${ix + 1}`,
    name: `Player ${ix + 1}`,
  }));

const renderPresenter = ({ players = [] }: { players?: Player[] } = {}) => {
  const jotaiStore = createStore();
  jotaiStore.set(lobbyAtom, { ...initialLobbyState, players });
  initializeMockSignalR(jotaiStore);
  return render(
    <ThemeProvider theme={createTheme({})}>
      <JotaiProvider store={jotaiStore}>
        <FistOfFivePresenter />
      </JotaiProvider>
    </ThemeProvider>
  );
};

describe("FistOfFive Presenter", () => {
  describe("when no players have joined the lobby", () => {
    it("shows it is waiting for participants", () => {
      renderPresenter();
      expect(
        screen.getByText("Waiting for participants to join...")
      ).toBeInTheDocument();
    });
  });

  describe("when players are in the lobby", () => {
    it("shows the response count out of the lobby player count", () => {
      renderPresenter({ players: createPlayers(3) });
      expect(
        screen.getByText("0 of 3 participants have responded")
      ).toBeInTheDocument();
    });
  });
});
