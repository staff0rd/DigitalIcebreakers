import { act, render, screen } from "@testing-library/react";
import { Provider as JotaiProvider, createStore } from "jotai";
import { describe, it, expect, vi } from "vitest";
import DoggosVsKittehsPresenter from "./DoggosVsKittehsPresenter";
import { setLobbyGameAtom } from "../../store/jotai/transportAtoms";
import { initializeMockTransport } from "../../store/jotai/transportTestHelpers";
import { lobbyAtom, initialLobbyState } from "../../store/atoms/lobbyAtoms";

vi.mock("../pixi/Pixi", () => ({
  Pixi: (props: Record<string, unknown>) => {
    const dataProps = Object.fromEntries(
      Object.entries(props).filter(([key]) => key.startsWith("data-"))
    );
    return <div {...dataProps} />;
  },
}));

vi.mock("../pixi/Graph", () => ({
  Graph: vi.fn(),
}));

const playerVote = (id: string, payload: string) => ({
  payload,
  id,
  name: id,
});

const renderPresenter = ({ playerCount = 3 } = {}) => {
  const jotaiStore = createStore();
  const { emit } = initializeMockTransport(jotaiStore);
  jotaiStore.set(lobbyAtom, {
    ...initialLobbyState,
    isPresenter: true,
    players: Array.from({ length: playerCount }, (_, ix) => ({
      id: `player-${ix + 1}`,
      name: `Player ${ix + 1}`,
    })),
  });
  render(
    <JotaiProvider store={jotaiStore}>
      <DoggosVsKittehsPresenter />
    </JotaiProvider>
  );
  act(() => jotaiStore.set(setLobbyGameAtom, "doggos-vs-kittehs"));
  return {
    emit,
    view: () => screen.getByTestId("doggos-vs-kittehs-presenter"),
  };
};

describe("DoggosVsKittehsPresenter", () => {
  it("counts everyone as undecided before any votes", () => {
    const { view } = renderPresenter({ playerCount: 3 });

    expect(view()).toHaveAttribute("data-doggos", "0");
    expect(view()).toHaveAttribute("data-kittehs", "0");
    expect(view()).toHaveAttribute("data-undecided", "3");
  });

  describe("when players vote", () => {
    it("tallies doggos and kittehs votes", () => {
      const { emit, view } = renderPresenter({ playerCount: 3 });

      emit("gameMessage", playerVote("player-1", "0"));
      emit("gameMessage", playerVote("player-2", "1"));

      expect(view()).toHaveAttribute("data-doggos", "1");
      expect(view()).toHaveAttribute("data-kittehs", "1");
      expect(view()).toHaveAttribute("data-undecided", "1");
    });

    it("counts only the latest vote per player", () => {
      const { emit, view } = renderPresenter({ playerCount: 2 });

      emit("gameMessage", playerVote("player-1", "1"));
      emit("gameMessage", playerVote("player-1", "0"));

      expect(view()).toHaveAttribute("data-doggos", "1");
      expect(view()).toHaveAttribute("data-kittehs", "0");
      expect(view()).toHaveAttribute("data-undecided", "1");
    });
  });
});
