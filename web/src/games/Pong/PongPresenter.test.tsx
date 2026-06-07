import { render, screen, act } from "@testing-library/react";
import { Provider, createStore } from "jotai";
import PongPresenter from "./PongPresenter";
import {
  pongAtom,
  rightScoresAtom,
  leftScoresAtom,
  resetScoresAtom,
} from "./pongAtoms";
import { lobbyAtom, initialLobbyState } from "../../store/atoms/lobbyAtoms";
import { setLobbyGameAtom } from "../../store/jotai/transportAtoms";
import { initializeMockTransport } from "../../store/jotai/transportTestHelpers";
import { Player } from "../../Player";
import { vi } from "vitest";

// Mock PIXI.js to avoid canvas errors in tests
vi.mock("pixi.js", () => ({
  Application: vi.fn(),
  Graphics: vi.fn(() => ({
    clear: vi.fn(),
    beginFill: vi.fn(),
    drawRect: vi.fn(),
    pivot: { set: vi.fn() },
    position: { set: vi.fn() },
  })),
  Text: vi.fn(),
  Container: vi.fn(),
}));

// Mock PIXI to avoid canvas errors in tests
vi.mock("../pixi/Pixi", () => ({
  Pixi: () => <div data-testid="pixi-canvas" />,
}));

// Mock ReactAnimationFrame HOC
vi.mock("./ReactAnimationFrame", () => ({
  default: (Component: React.ComponentType) => Component,
}));

const player = (n: number): Player => ({ id: `p${n}`, name: `Player ${n}` });

const teamAttribute = (team: "blue" | "red", attribute: string) =>
  document.getElementById(`${team}-team`)?.getAttribute(attribute);

const renderPresenter = ({ players = [] }: { players?: Player[] } = {}) => {
  const jotaiStore = createStore();
  jotaiStore.set(lobbyAtom, {
    ...initialLobbyState,
    isPresenter: true,
    players,
  });
  const { emit, sentPresenterMessages } = initializeMockTransport(jotaiStore);
  const result = render(
    <Provider store={jotaiStore}>
      <PongPresenter />
    </Provider>
  );
  act(() => jotaiStore.set(setLobbyGameAtom, "pong"));

  const setPlayers = (next: Player[]) =>
    act(() =>
      jotaiStore.set(lobbyAtom, { ...jotaiStore.get(lobbyAtom), players: next })
    );

  const press = (playerId: string, action: string) =>
    act(() =>
      emit("gameMessage", { id: playerId, name: playerId, payload: action })
    );

  return { ...result, jotaiStore, setPlayers, press, sentPresenterMessages };
};

describe("PongPresenter", () => {
  describe("when players are in the lobby", () => {
    it("splits them evenly between the teams", () => {
      renderPresenter({ players: [1, 2, 3, 4].map(player) });

      expect(teamAttribute("blue", "data-count")).toBe("2");
      expect(teamAttribute("red", "data-count")).toBe("2");
    });

    it("tells the players which team they are on", () => {
      const { sentPresenterMessages } = renderPresenter({
        players: [1, 2, 3, 4].map(player),
      });

      expect(sentPresenterMessages()).toContainEqual({
        assignments: { p1: 0, p2: 1, p3: 0, p4: 1 },
      });
    });
  });

  describe("when one team empties out", () => {
    it("moves a player across to keep both teams filled", () => {
      const { setPlayers, sentPresenterMessages } = renderPresenter({
        players: [1, 2, 3, 4].map(player),
      });

      // p1 and p3 (blue) leave; red must give up a player
      setPlayers([2, 4].map(player));

      expect(teamAttribute("blue", "data-count")).toBe("1");
      expect(teamAttribute("red", "data-count")).toBe("1");
      const messages = sentPresenterMessages();
      const latest = messages[messages.length - 1] as {
        assignments: Record<string, number>;
      };
      expect(Object.values(latest.assignments).sort()).toEqual([0, 1]);
    });
  });

  describe("when players hold their paddle buttons", () => {
    it("averages the directions held by each team", () => {
      const { press } = renderPresenter({ players: [1, 2, 3, 4].map(player) });

      press("p1", "up");
      expect(teamAttribute("blue", "data-speed")).toBe("0.5");
      expect(teamAttribute("red", "data-speed")).toBe("0");

      press("p3", "up");
      expect(teamAttribute("blue", "data-speed")).toBe("1");

      press("p1", "release");
      expect(teamAttribute("blue", "data-speed")).toBe("0.5");

      press("p2", "down");
      expect(teamAttribute("red", "data-speed")).toBe("-0.5");
    });
  });

  describe("when game starts", () => {
    it("should display score as 0-0", () => {
      renderPresenter();

      expect(screen.getByText("0-0")).toBeInTheDocument();
    });
  });

  describe("when left team scores", () => {
    it("should display 1-0", () => {
      const { jotaiStore } = renderPresenter();

      act(() => {
        jotaiStore.set(leftScoresAtom);
      });

      expect(screen.getByText("1-0")).toBeInTheDocument();
    });
  });

  describe("when right team scores", () => {
    it("should display 0-1", () => {
      const { jotaiStore } = renderPresenter();

      act(() => {
        jotaiStore.set(rightScoresAtom);
      });

      expect(screen.getByText("0-1")).toBeInTheDocument();
    });
  });

  describe("when score is already set", () => {
    describe("and reset is triggered", () => {
      it("should display 0-0", () => {
        const { jotaiStore } = renderPresenter();

        act(() => {
          const state = jotaiStore.get(pongAtom);
          jotaiStore.set(pongAtom, {
            ...state,
            presenter: { ...state.presenter, score: [5, 3] },
          });
        });

        // Verify initial score is set
        expect(screen.getByText("5-3")).toBeInTheDocument();

        // Reset scores
        act(() => {
          jotaiStore.set(resetScoresAtom);
        });

        expect(screen.getByText("0-0")).toBeInTheDocument();
      });
    });
  });
});
