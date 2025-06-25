import { render, screen, act } from "@testing-library/react";
import { Provider, createStore } from "jotai";
import { Provider as ReduxProvider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "../../store/rootReducer";
import { pongAtom } from "./pongAtoms";
import { getGameHandler } from "../../store/jotai/gameMessageHandlers";
import { PongClient } from "./PongClient";

describe("PongClient", () => {
  const renderWithProviders = (component: React.ReactElement) => {
    // Need Redux for dispatch/clientMessage until that's migrated
    const store = configureStore({
      reducer: rootReducer,
    });
    const jotaiStore = createStore();
    return {
      ...render(
        <ReduxProvider store={store}>
          <Provider store={jotaiStore}>{component}</Provider>
        </ReduxProvider>
      ),
      jotaiStore,
    };
  };

  describe("when player is assigned to blue team", () => {
    it("should display blue control buttons", () => {
      const { jotaiStore } = renderWithProviders(<PongClient />);
      
      // Simulate receiving team assignment message
      act(() => {
        const handler = getGameHandler("pong");
        const currentState = jotaiStore.get(pongAtom);
        const newState = handler!.messageHandler(currentState, "team:0", false);
        jotaiStore.set(pongAtom, newState);
      });

      const upButton = screen.getByRole("button", { name: /up/i });
      const downButton = screen.getByRole("button", { name: /down/i });
      
      // Blue team colors from PongColors
      expect(upButton).toHaveStyle({ backgroundColor: "rgb(30, 136, 229)" }); // 0x1e88e5
      expect(downButton).toHaveStyle({ backgroundColor: "rgb(30, 136, 229)" });
    });
  });

  describe("when player is assigned to red team", () => {
    it("should display red control buttons", () => {
      const { jotaiStore } = renderWithProviders(<PongClient />);
      
      // Simulate receiving team assignment message
      act(() => {
        const handler = getGameHandler("pong");
        const currentState = jotaiStore.get(pongAtom);
        const newState = handler!.messageHandler(currentState, "team:1", false);
        jotaiStore.set(pongAtom, newState);
      });

      const upButton = screen.getByRole("button", { name: /up/i });
      const downButton = screen.getByRole("button", { name: /down/i });
      
      // Red team colors from PongColors  
      expect(upButton).toHaveStyle({ backgroundColor: "rgb(229, 57, 53)" }); // 0xe53935
      expect(downButton).toHaveStyle({ backgroundColor: "rgb(229, 57, 53)" });
    });
  });
});