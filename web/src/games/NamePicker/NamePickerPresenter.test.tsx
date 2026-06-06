import { render, screen } from "@testing-library/react";
import { Provider as JotaiProvider, createStore } from "jotai";
import { Provider as ReduxProvider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { describe, it, expect, vi } from "vitest";
import NamePickerPresenter from "./NamePickerPresenter";
import { lobbyAtom, initialLobbyState } from "store/atoms/lobbyAtoms";
import { Player } from "Player";

vi.mock("../pixi/Pixi", () => ({
  Pixi: ({
    backgroundColor,
    onAppChange,
    ...rest
  }: Record<string, unknown>) => <div data-testid="pixi" {...rest} />,
}));

const renderPresenter = ({ players = [] }: { players?: Player[] } = {}) => {
  const jotaiStore = createStore();
  jotaiStore.set(lobbyAtom, { ...initialLobbyState, players });
  const reduxStore = configureStore({ reducer: () => ({}) });
  return render(
    <ReduxProvider store={reduxStore}>
      <JotaiProvider store={jotaiStore}>
        <NamePickerPresenter />
      </JotaiProvider>
    </ReduxProvider>
  );
};

describe("NamePicker Presenter", () => {
  it("shows the names of the players in the lobby", () => {
    renderPresenter({
      players: [
        { id: "p1", name: "Alice" },
        { id: "p2", name: "Bob" },
      ],
    });
    expect(screen.getByTestId("pixi")).toHaveAttribute(
      "data-names",
      "Alice,Bob"
    );
  });
});
