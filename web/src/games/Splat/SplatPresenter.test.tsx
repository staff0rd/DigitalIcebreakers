import { useEffect } from "react";
import { act, render } from "@testing-library/react";
import { Provider as JotaiProvider, createStore } from "jotai";
import { describe, it, expect, vi } from "vitest";
import SplatPresenter from "./SplatPresenter";
import { setLobbyGameAtom } from "../../store/jotai/signalRAtoms";
import { initializeMockSignalR } from "../../store/jotai/signalRTestHelpers";

vi.mock("pixi.js", () => ({
  Graphics: vi.fn(() => {
    const graphics = {
      beginFill: vi.fn(() => graphics),
      drawCircle: vi.fn(() => graphics),
      endFill: vi.fn(() => graphics),
    };
    return graphics;
  }),
}));

const createFakePixiApp = () => {
  const children: unknown[] = [];
  return {
    screen: { width: 800, height: 600 },
    stage: {
      children,
      addChild: (child: unknown) => children.push(child),
    },
  };
};

type FakePixiApp = ReturnType<typeof createFakePixiApp>;

const fakeApps: FakePixiApp[] = [];

vi.mock("../pixi/Pixi", () => ({
  Pixi: ({ onAppChange }: { onAppChange: (app: unknown) => void }) => {
    useEffect(() => {
      const app = createFakePixiApp();
      fakeApps.push(app);
      onAppChange(app);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return <div data-testid="pixi-canvas" />;
  },
}));

const playerPress = (payload: string) => ({
  payload,
  id: "player-1",
  name: "Alice",
});

const renderSplatPresenter = () => {
  const jotaiStore = createStore();
  const { emit } = initializeMockSignalR(jotaiStore);
  render(
    <JotaiProvider store={jotaiStore}>
      <SplatPresenter />
    </JotaiProvider>
  );
  act(() => jotaiStore.set(setLobbyGameAtom, "splat"));
  return { emit, app: fakeApps[fakeApps.length - 1] };
};

describe("SplatPresenter", () => {
  describe("when a player presses the button", () => {
    it("draws a circle", () => {
      const { emit, app } = renderSplatPresenter();

      emit("gameMessage", playerPress("down"));

      expect(app.stage.children).toHaveLength(1);
    });
  });

  describe("when players press the button multiple times", () => {
    it("draws a circle for each press", () => {
      const { emit, app } = renderSplatPresenter();

      emit("gameMessage", playerPress("down"));
      emit("gameMessage", playerPress("down"));
      emit("gameMessage", playerPress("down"));

      expect(app.stage.children).toHaveLength(3);
    });
  });

  describe("when a player releases the button", () => {
    it("does not draw a circle", () => {
      const { emit, app } = renderSplatPresenter();

      emit("gameMessage", playerPress("up"));

      expect(app.stage.children).toHaveLength(0);
    });
  });
});
