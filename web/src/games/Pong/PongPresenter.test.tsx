import { render, screen, act } from "@testing-library/react";
import { Provider, createStore } from "jotai";
import PongPresenter from "./PongPresenter";
import { pongAtom, rightScoresAtom, leftScoresAtom, resetScoresAtom, PongState } from "./pongAtoms";
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

// Deep partial type helper
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Factory method for creating test pong state
const createPongState = (overrides?: DeepPartial<PongState>): PongState => {
  const defaultState: PongState = {
    client: {
      releasedColor: 0xffffff,
      pressedColor: 0xffffff,
      team: "",
    },
    presenter: {
      leftSpeed: 0,
      rightSpeed: 0,
      leftTeam: 0,
      rightTeam: 0,
      paddleSpeed: 200,
      paddleHeight: 5,
      paddleWidth: 55,
      ballSpeed: 3,
      score: [0, 0],
    },
  };

  return {
    ...defaultState,
    client: {
      ...defaultState.client,
      ...(overrides?.client || {}),
    },
    presenter: {
      ...defaultState.presenter,
      ...(overrides?.presenter || {}),
    },
  };
};

describe("PongPresenter", () => {
  const renderWithProviders = (
    component: React.ReactElement,
    initialState?: DeepPartial<PongState>
  ) => {
    const jotaiStore = createStore();
    
    // Hydrate atoms with initial state if provided
    if (initialState) {
      jotaiStore.set(pongAtom, createPongState(initialState));
    }
    
    return {
      ...render(
        <Provider store={jotaiStore}>{component}</Provider>
      ),
      jotaiStore,
    };
  };

  describe("when game starts", () => {
    it("should display score as 0-0", () => {
      renderWithProviders(<PongPresenter />);
      
      expect(screen.getByText("0-0")).toBeInTheDocument();
    });
  });

  describe("when left team scores", () => {
    it("should display 1-0", () => {
      const { jotaiStore } = renderWithProviders(<PongPresenter />);
      
      act(() => {
        jotaiStore.set(leftScoresAtom);
      });

      expect(screen.getByText("1-0")).toBeInTheDocument();
    });
  });

  describe("when right team scores", () => {
    it("should display 0-1", () => {
      const { jotaiStore } = renderWithProviders(<PongPresenter />);
      
      act(() => {
        jotaiStore.set(rightScoresAtom);
      });

      expect(screen.getByText("0-1")).toBeInTheDocument();
    });
  });

  describe("when score is already set", () => {
    describe("and reset is triggered", () => {
      it("should display 0-0", () => {
        const { jotaiStore } = renderWithProviders(
          <PongPresenter />,
          {
            presenter: {
              score: [5, 3],
            },
          }
        );

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