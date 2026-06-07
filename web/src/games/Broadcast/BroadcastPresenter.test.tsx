import { render, screen, act, fireEvent } from "@testing-library/react";
import { createTheme } from "@mui/material";
import { ThemeProvider } from "@mui/styles";
import { Provider as JotaiProvider, createStore } from "jotai";
import { describe, it, expect } from "vitest";
import { BroadcastPresenter } from "./BroadcastPresenter";
import { broadcastAtom } from "./broadcastAtoms";
import { lobbyAtom, initialLobbyState } from "../../store/atoms/lobbyAtoms";
import { setLobbyGameAtom } from "../../store/jotai/transportAtoms";
import { initializeMockTransport } from "../../store/jotai/transportTestHelpers";

const renderPresenter = ({
  presenter = { text: "", dings: 0 },
}: { presenter?: { text: string; dings: number } } = {}) => {
  const jotaiStore = createStore();
  const transport = initializeMockTransport(jotaiStore);
  jotaiStore.set(lobbyAtom, { ...initialLobbyState, isPresenter: true });
  jotaiStore.set(broadcastAtom, { client: { text: "" }, presenter });
  render(
    <ThemeProvider theme={createTheme({})}>
      <JotaiProvider store={jotaiStore}>
        <BroadcastPresenter />
      </JotaiProvider>
    </ThemeProvider>
  );
  act(() => jotaiStore.set(setLobbyGameAtom, "broadcast"));
  return { jotaiStore, ...transport };
};

describe("BroadcastPresenter", () => {
  describe("when typing a message", () => {
    it("broadcasts the text to players", () => {
      const { sentPresenterMessages } = renderPresenter();

      fireEvent.change(screen.getByRole("textbox"), {
        target: { value: "hello" },
      });

      expect(sentPresenterMessages()).toContainEqual("hello");
    });
  });

  describe("when a player dings", () => {
    it("counts the ding", () => {
      const { emit } = renderPresenter();

      emit("gameMessage", { payload: 1, id: "player-1", name: "Alice" });

      expect(screen.getByText("Dings: 1")).toBeInTheDocument();
    });
  });

  describe("when the presenter rejoins with restored state", () => {
    it("keeps the dings and the broadcast text", () => {
      renderPresenter({ presenter: { text: "welcome", dings: 3 } });

      expect(screen.getByText("Dings: 3")).toBeInTheDocument();
      expect(screen.getByRole("textbox")).toHaveValue("welcome");
    });
  });

  describe("when a new broadcast starts", () => {
    it("starts with no dings and no text", () => {
      const { emit } = renderPresenter({
        presenter: { text: "old", dings: 5 },
      });

      emit("newgame", "broadcast");

      expect(screen.getByText("Dings: 0")).toBeInTheDocument();
      expect(screen.getByRole("textbox")).toHaveValue("");
    });
  });
});
