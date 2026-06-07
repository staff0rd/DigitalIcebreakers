import { render, screen, act, fireEvent } from "@testing-library/react";
import { Provider, createStore } from "jotai";
import { PongClient } from "./PongClient";
import { userAtom } from "../../store/atoms/userAtoms";
import { setLobbyGameAtom } from "../../store/jotai/transportAtoms";
import { initializeMockTransport } from "../../store/jotai/transportTestHelpers";

const renderClient = ({ userId = "me" } = {}) => {
  const jotaiStore = createStore();
  jotaiStore.set(userAtom, { id: userId, name: "Me", isRegistered: true });
  const { emit, sentClientMessages } = initializeMockTransport(jotaiStore);
  const result = render(
    <Provider store={jotaiStore}>
      <PongClient />
    </Provider>
  );
  act(() => jotaiStore.set(setLobbyGameAtom, "pong"));

  const receiveAssignments = (assignments: Record<string, number>) =>
    act(() => emit("gameMessage", { assignments }));

  return { ...result, receiveAssignments, sentClientMessages };
};

describe("PongClient", () => {
  describe("when the player is assigned to the blue team", () => {
    it("should display blue control buttons", () => {
      const { receiveAssignments } = renderClient();

      receiveAssignments({ me: 0, someoneElse: 1 });

      expect(screen.getByTestId("team")).toHaveTextContent("blue");
      const upButton = screen.getByRole("button", { name: /up/i });
      const downButton = screen.getByRole("button", { name: /down/i });

      // Blue team colors from PongColors
      expect(upButton).toHaveStyle({ backgroundColor: "rgb(30, 136, 229)" }); // 0x1e88e5
      expect(downButton).toHaveStyle({ backgroundColor: "rgb(30, 136, 229)" });
    });
  });

  describe("when the player is assigned to the red team", () => {
    it("should display red control buttons", () => {
      const { receiveAssignments } = renderClient();

      receiveAssignments({ me: 1, someoneElse: 0 });

      expect(screen.getByTestId("team")).toHaveTextContent("red");
      const upButton = screen.getByRole("button", { name: /up/i });
      const downButton = screen.getByRole("button", { name: /down/i });

      // Red team colors from PongColors
      expect(upButton).toHaveStyle({ backgroundColor: "rgb(229, 57, 53)" }); // 0xe53935
      expect(downButton).toHaveStyle({ backgroundColor: "rgb(229, 57, 53)" });
    });
  });

  describe("when the player holds and releases a paddle button", () => {
    it("sends the direction and then the release", () => {
      const { receiveAssignments, sentClientMessages } = renderClient();
      receiveAssignments({ me: 0 });

      const upButton = screen.getByRole("button", { name: /up/i });
      fireEvent.mouseDown(upButton);
      fireEvent.mouseUp(upButton);

      expect(sentClientMessages()).toEqual(["up", "release"]);
    });
  });
});
