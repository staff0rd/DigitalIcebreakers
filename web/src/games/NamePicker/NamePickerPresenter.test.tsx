import { render, screen } from "@testing-library/react";
import { Provider as JotaiProvider, createStore } from "jotai";
import { describe, it, expect, vi } from "vitest";
import NamePickerPresenter from "./NamePickerPresenter";
import { lobbyAtom, initialLobbyState } from "store/atoms/lobbyAtoms";
import { initializeMockSignalR } from "store/jotai/signalRTestHelpers";
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
  initializeMockSignalR(jotaiStore);
  return render(
    <JotaiProvider store={jotaiStore}>
      <NamePickerPresenter />
    </JotaiProvider>
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
