import { act, render, screen } from "@testing-library/react";
import { Provider as JotaiProvider, createStore } from "jotai";
import { describe, it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import YesNoMaybePresenter from "./YesNoMaybePresenter";
import { YesNoMaybeMenu } from "./YesNoMaybeMenu";
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
      <YesNoMaybePresenter />
      <YesNoMaybeMenu />
    </JotaiProvider>
  );
  act(() => jotaiStore.set(setLobbyGameAtom, "yes-no-maybe"));
  return { emit, view: () => screen.getByTestId("yes-no-maybe-presenter") };
};

describe("YesNoMaybePresenter", () => {
  it("counts everyone as maybe before any votes", () => {
    const { view } = renderPresenter({ playerCount: 3 });

    expect(view()).toHaveAttribute("data-yes", "0");
    expect(view()).toHaveAttribute("data-no", "0");
    expect(view()).toHaveAttribute("data-maybe", "3");
  });

  describe("when players vote", () => {
    it("tallies yes and no votes", () => {
      const { emit, view } = renderPresenter({ playerCount: 3 });

      emit("gameMessage", playerVote("player-1", "0"));
      emit("gameMessage", playerVote("player-2", "1"));

      expect(view()).toHaveAttribute("data-yes", "1");
      expect(view()).toHaveAttribute("data-no", "1");
      expect(view()).toHaveAttribute("data-maybe", "1");
    });

    it("counts only the latest vote per player", () => {
      const { emit, view } = renderPresenter({ playerCount: 3 });

      emit("gameMessage", playerVote("player-1", "0"));
      emit("gameMessage", playerVote("player-1", "1"));

      expect(view()).toHaveAttribute("data-yes", "0");
      expect(view()).toHaveAttribute("data-no", "1");
    });
  });

  describe("when the presenter resets the vote", () => {
    it("clears all votes", async () => {
      const { emit, view } = renderPresenter({ playerCount: 2 });
      emit("gameMessage", playerVote("player-1", "0"));
      emit("gameMessage", playerVote("player-2", "1"));

      await userEvent.click(screen.getByRole("button", { name: "Reset" }));

      expect(view()).toHaveAttribute("data-yes", "0");
      expect(view()).toHaveAttribute("data-no", "0");
      expect(view()).toHaveAttribute("data-maybe", "2");
    });
  });
});
