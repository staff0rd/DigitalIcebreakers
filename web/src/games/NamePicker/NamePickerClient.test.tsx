import { render, screen, act } from "@testing-library/react";
import { Provider as JotaiProvider, createStore } from "jotai";
import { describe, it, expect } from "vitest";
import NamePickerClient from "./NamePickerClient";
import { userAtom } from "../../store/atoms/userAtoms";
import { namePickerAtom, NamePickerState } from "./namePickerAtoms";
import { UserState } from "../../store/user/types";
import { setLobbyGameAtom } from "../../store/jotai/transportAtoms";
import { initializeMockTransport } from "../../store/jotai/transportTestHelpers";

const renderNamePickerClient = ({
  user = {},
  selectedId,
}: {
  user?: Partial<UserState>;
  selectedId?: string;
} = {}) => {
  const jotaiStore = createStore();
  jotaiStore.set(userAtom, {
    id: "user-1",
    name: "Alice",
    isRegistered: true,
    ...user,
  });
  const namePickerState: NamePickerState = {
    presenter: { shouldPick: false },
    player: { selectedId },
  };
  jotaiStore.set(namePickerAtom, namePickerState);
  return render(
    <JotaiProvider store={jotaiStore}>
      <NamePickerClient />
    </JotaiProvider>
  );
};

describe("NamePickerClient", () => {
  it("shows the user's name", () => {
    renderNamePickerClient({ user: { name: "Alice" } });
    expect(screen.getByRole("heading", { name: "Alice" })).toBeInTheDocument();
  });

  describe("when the user is picked", () => {
    it("tells the user they won", () => {
      renderNamePickerClient({ user: { id: "user-1" }, selectedId: "user-1" });
      expect(screen.getByText("You won!")).toBeInTheDocument();
    });
  });

  describe("when another player is picked", () => {
    it("tells the user they lost", () => {
      renderNamePickerClient({ user: { id: "user-1" }, selectedId: "user-2" });
      expect(screen.getByText("You lost :(")).toBeInTheDocument();
    });
  });

  describe("when nobody has been picked", () => {
    it("shows no result", () => {
      renderNamePickerClient();
      expect(screen.queryByText("You won!")).not.toBeInTheDocument();
      expect(screen.queryByText("You lost :(")).not.toBeInTheDocument();
    });
  });

  describe("when the presenter announces a pick", () => {
    const renderConnectedClient = () => {
      const jotaiStore = createStore();
      const { emit } = initializeMockTransport(jotaiStore);
      jotaiStore.set(userAtom, {
        id: "user-1",
        name: "Alice",
        isRegistered: true,
      });
      render(
        <JotaiProvider store={jotaiStore}>
          <NamePickerClient />
        </JotaiProvider>
      );
      act(() => jotaiStore.set(setLobbyGameAtom, "name-picker"));
      return { emit };
    };

    it("tells the picked player they won", () => {
      const { emit } = renderConnectedClient();

      emit("gameMessage", { id: "user-1" });

      expect(screen.getByText("You won!")).toBeInTheDocument();
    });

    it("tells other players they lost", () => {
      const { emit } = renderConnectedClient();

      emit("gameMessage", { id: "user-2" });

      expect(screen.getByText("You lost :(")).toBeInTheDocument();
    });

    describe("and the presenter resets the pick", () => {
      it("clears the result", () => {
        const { emit } = renderConnectedClient();
        emit("gameMessage", { id: "user-1" });

        emit("gameMessage", {});

        expect(screen.queryByText("You won!")).not.toBeInTheDocument();
        expect(screen.queryByText("You lost :(")).not.toBeInTheDocument();
      });
    });
  });
});
