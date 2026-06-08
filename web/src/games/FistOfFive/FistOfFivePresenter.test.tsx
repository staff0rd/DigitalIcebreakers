import { render, screen, act } from "@testing-library/react";
import { createTheme } from "@mui/material";
import { ThemeProvider } from "@mui/styles";
import { Provider as JotaiProvider, createStore } from "jotai";
import { describe, it, expect } from "vitest";
import FistOfFivePresenter from "./FistOfFivePresenter";
import { lobbyAtom, initialLobbyState } from "store/atoms/lobbyAtoms";
import { setLobbyGameAtom } from "store/jotai/transportAtoms";
import { initializeMockTransport } from "store/jotai/transportTestHelpers";
import { fistOfFiveAtom, FistOfFiveState } from "./fistOfFiveAtoms";
import { Player } from "Player";

const createPlayers = (count: number): Player[] =>
  Array.from({ length: count }, (_, ix) => ({
    id: `player-${ix + 1}`,
    name: `Player ${ix + 1}`,
  }));

const renderPresenter = ({
  players = [],
  initialState,
}: { players?: Player[]; initialState?: FistOfFiveState } = {}) => {
  const jotaiStore = createStore();
  jotaiStore.set(lobbyAtom, {
    ...initialLobbyState,
    isPresenter: true,
    players,
  });
  const transport = initializeMockTransport(jotaiStore);
  if (initialState) {
    jotaiStore.set(fistOfFiveAtom, initialState);
  }
  const result = render(
    <ThemeProvider theme={createTheme({})}>
      <JotaiProvider store={jotaiStore}>
        <FistOfFivePresenter />
      </JotaiProvider>
    </ThemeProvider>
  );
  act(() => jotaiStore.set(setLobbyGameAtom, "fist-of-five"));
  return { ...result, jotaiStore, ...transport };
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

  describe("when a player responds", () => {
    it("counts the response", () => {
      const { emit } = renderPresenter({ players: createPlayers(3) });

      emit("gameMessage", {
        id: "player-1",
        name: "Player 1",
        payload: { questionId: "0", answerId: "4" },
      });

      expect(
        screen.getByText("1 of 3 participants have responded")
      ).toBeInTheDocument();
    });

    it("replaces the player's previous response", () => {
      const { emit } = renderPresenter({ players: createPlayers(3) });

      emit("gameMessage", {
        id: "player-1",
        name: "Player 1",
        payload: { questionId: "0", answerId: "4" },
      });
      emit("gameMessage", {
        id: "player-1",
        name: "Player 1",
        payload: { questionId: "0", answerId: "2" },
      });

      expect(
        screen.getByText("1 of 3 participants have responded")
      ).toBeInTheDocument();
    });
  });

  describe("when the presenter rejoins with restored responses", () => {
    it("keeps the restored responses", () => {
      renderPresenter({
        players: createPlayers(3),
        initialState: {
          presenter: {
            questions: [
              {
                id: "0",
                text: "",
                answers: [{ id: "1", text: "1" }],
                responses: [
                  { playerId: "player-1", playerName: "Player 1", answerId: "1" },
                ],
              },
            ],
            showResponses: false,
            currentQuestionId: "0",
          },
          player: {
            questionId: "0",
            question: "",
            answers: [],
            selectedAnswerId: "",
            answerLocked: false,
            canAnswer: true,
          },
        },
      });

      expect(
        screen.getByText("1 of 3 participants have responded")
      ).toBeInTheDocument();
    });
  });
});
