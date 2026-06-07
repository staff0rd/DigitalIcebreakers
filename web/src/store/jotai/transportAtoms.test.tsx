import { render, screen, act } from "@testing-library/react";
import { createTheme } from "@mui/material";
import { ThemeProvider } from "@mui/styles";
import { Provider as JotaiProvider, createStore } from "jotai";
import { describe, it, expect } from "vitest";
import { ConnectionStatus } from "ConnectionStatus";
import { ConnectionIcon } from "components/ConnectionIcon";
import { PongClient } from "games/Pong/PongClient";
import { UserState } from "store/user/types";
import { LobbyState } from "store/lobby/types";
import { userAtom } from "store/atoms/userAtoms";
import { connectionStatusAtom } from "store/atoms/connectionAtoms";
import { lobbyAtom, initialLobbyState } from "store/atoms/lobbyAtoms";
import {
  updateConnectionStatusAtom,
  setUserNameAtom,
  createLobbyAtom,
  setLobbyGameAtom,
  goToDefaultUrlAtom,
  clientMessageAtom,
  presenterMessageAtom,
} from "./transportAtoms";
import { initializeMockTransport } from "./transportTestHelpers";
import { atom } from "jotai";
import { registerGame } from "./gameMessageHandlers";

type TestGameState = { log: string[] };

const testGameAtom = atom<TestGameState>({ log: [] });

registerGame(
  "test-game",
  testGameAtom,
  (state: TestGameState, message: unknown) => ({
    log: [...state.log, JSON.stringify(message)],
  }),
  { resetState: () => ({ log: ["fresh"] }) }
);

type SignalRAppOptions = {
  user?: Partial<UserState>;
  lobby?: Partial<LobbyState>;
  connectionStatus?: ConnectionStatus;
};

const createSignalRApp = (options: SignalRAppOptions = {}) => {
  const jotaiStore = createStore();
  jotaiStore.set(userAtom, {
    id: "user-1",
    name: "",
    isRegistered: false,
    ...options.user,
  });
  jotaiStore.set(
    connectionStatusAtom,
    options.connectionStatus ?? ConnectionStatus.NotConnected
  );
  jotaiStore.set(lobbyAtom, { ...initialLobbyState, ...options.lobby });
  return { jotaiStore, ...initializeMockTransport(jotaiStore) };
};

const listenForNavigation = () => {
  const paths: string[] = [];
  window.addEventListener("navigate-action", (event) =>
    paths.push((event as CustomEvent).detail.path)
  );
  return paths;
};

const renderWithJotai = (
  ui: React.ReactElement,
  jotaiStore: ReturnType<typeof createStore>
) =>
  render(
    <ThemeProvider theme={createTheme({})}>
      <JotaiProvider store={jotaiStore}>{ui}</JotaiProvider>
    </ThemeProvider>
  );

describe("real-time game message routing", () => {
  describe("when a game is in progress", () => {
    it("updates the game's client UI from incoming game messages", () => {
      const { jotaiStore, emit } = createSignalRApp();
      renderWithJotai(<PongClient />, jotaiStore);
      act(() => jotaiStore.set(setLobbyGameAtom, "pong"));
      emit("gameMessage", "team:0");
      expect(screen.getByRole("button", { name: /up/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /down/i })).toBeInTheDocument();
    });
  });

  describe("when the server starts a new game", () => {
    it("routes subsequent game messages to the new game", () => {
      const { jotaiStore, emit } = createSignalRApp();
      renderWithJotai(<PongClient />, jotaiStore);
      emit("newgame", "pong");
      emit("gameMessage", "team:1");
      expect(jotaiStore.get(lobbyAtom).currentGame).toBe("pong");
      expect(screen.getByRole("button", { name: /up/i })).toBeInTheDocument();
    });
  });
});

describe("mirroring game state", () => {
  const reconnectPayload = (overrides: Record<string, unknown> = {}) => ({
    lobbyId: "AAAA",
    lobbyName: "lobby",
    playerId: "user-1",
    playerName: "Alice",
    players: [],
    currentGame: "test-game",
    isRegistered: true,
    isPresenter: false,
    ...overrides,
  });

  describe("when a presenter reconnects with mirrored state", () => {
    it("restores the game state", () => {
      const { jotaiStore, emit } = createSignalRApp({
        lobby: { isPresenter: true },
        connectionStatus: ConnectionStatus.Connected,
      });
      emit(
        "reconnect",
        reconnectPayload({
          isPresenter: true,
          presenterState: { log: ["restored"] },
        })
      );
      expect(jotaiStore.get(testGameAtom)).toEqual({ log: ["restored"] });
    });
  });

  describe("when a player reconnects with mirrored state", () => {
    it("restores the game state", () => {
      const { jotaiStore, emit } = createSignalRApp({
        user: { isRegistered: true },
        connectionStatus: ConnectionStatus.Connected,
      });
      emit(
        "reconnect",
        reconnectPayload({ playerState: { log: ["mine"] } })
      );
      expect(jotaiStore.get(testGameAtom)).toEqual({ log: ["mine"] });
    });
  });

  describe("when the presenter's game state changes", () => {
    it("publishes the state as presenter state", () => {
      const { jotaiStore, transport } = createSignalRApp({
        lobby: { isPresenter: true },
      });
      act(() => jotaiStore.set(setLobbyGameAtom, "test-game"));
      act(() => jotaiStore.set(testGameAtom, { log: ["splat"] }));
      expect(transport.publishPresenterState).toHaveBeenCalledWith({
        log: ["splat"],
      });
      expect(transport.publishPlayerState).not.toHaveBeenCalled();
    });
  });

  describe("when a player's game state changes", () => {
    it("publishes the state as player state", () => {
      const { jotaiStore, transport } = createSignalRApp();
      act(() => jotaiStore.set(setLobbyGameAtom, "test-game"));
      act(() => jotaiStore.set(testGameAtom, { log: ["picked"] }));
      expect(transport.publishPlayerState).toHaveBeenCalledWith({
        log: ["picked"],
      });
      expect(transport.publishPresenterState).not.toHaveBeenCalled();
    });
  });

  describe("when a new game starts", () => {
    it("resets the game state", () => {
      const { jotaiStore, emit } = createSignalRApp();
      jotaiStore.set(testGameAtom, { log: ["stale"] });
      emit("newgame", "test-game");
      expect(jotaiStore.get(testGameAtom)).toEqual({ log: ["fresh"] });
    });
  });
});

describe("sending game messages", () => {
  it("sends client messages to the hub", () => {
    const { jotaiStore, sentClientMessages } = createSignalRApp();
    jotaiStore.set(clientMessageAtom, "down");
    expect(sentClientMessages()).toEqual(["down"]);
  });

  it("sends presenter messages to the hub", () => {
    const { jotaiStore, sentPresenterMessages } = createSignalRApp();
    jotaiStore.set(presenterMessageAtom, { canAnswer: true });
    expect(sentPresenterMessages()).toEqual([{ canAnswer: true }]);
  });
});

describe("when joining a lobby", () => {
  describe("when not yet registered", () => {
    describe("when player", () => {
      it("should not set lobby", () => {
        const { jotaiStore, emit } = createSignalRApp({
          user: { isRegistered: false },
          lobby: { joiningLobbyId: "new-lobby" },
          connectionStatus: ConnectionStatus.Connected,
        });
        emit("reconnect", { lobbyId: "new-lobby" });
        expect(jotaiStore.get(lobbyAtom).id).toBeUndefined();
      });
    });
    describe("when presenter", () => {
      it("should set lobby", () => {
        const { jotaiStore, emit } = createSignalRApp({
          user: { isRegistered: false },
          lobby: { joiningLobbyId: "new-lobby", isPresenter: true },
          connectionStatus: ConnectionStatus.Connected,
        });
        emit("reconnect", { lobbyId: "new-lobby" });
        expect(jotaiStore.get(lobbyAtom).id).toBe("new-lobby");
      });
    });
  });

  it("should allow case insensitive join code", () => {
    const { jotaiStore, emit } = createSignalRApp({
      user: { isRegistered: true },
      lobby: { joiningLobbyId: "aaaa" },
      connectionStatus: ConnectionStatus.Connected,
    });
    emit("reconnect", {
      lobbyId: "AAAA",
      playerId: "player-1",
      playerName: "Bob",
      players: [],
      currentGame: "",
      isRegistered: true,
      lobbyName: "lobby",
      isPresenter: false,
    });
    expect(jotaiStore.get(lobbyAtom).id).toBe("AAAA");
  });
});

describe("when connected to an old lobby", () => {
  it("should not update to old lobby", () => {
    const { jotaiStore, emit } = createSignalRApp({
      lobby: { joiningLobbyId: "new-lobby" },
      connectionStatus: ConnectionStatus.Connected,
    });
    emit("reconnect", { lobbyId: "old-lobby" });
    expect(jotaiStore.get(lobbyAtom).id).toBeUndefined();
  });
});

describe("when connection achieved", () => {
  describe("when is joining lobby", () => {
    it("should join lobby", () => {
      const { jotaiStore, transport } = createSignalRApp({
        lobby: { joiningLobbyId: "some-lobby" },
      });
      jotaiStore.set(updateConnectionStatusAtom, ConnectionStatus.Connected);
      expect(transport.connectToLobby).toHaveBeenCalledWith(
        expect.objectContaining({ id: "user-1" }),
        "some-lobby"
      );
    });
  });

  it("shows the user as connected", () => {
    const { jotaiStore } = createSignalRApp();
    jotaiStore.set(updateConnectionStatusAtom, ConnectionStatus.Connected);
    renderWithJotai(<ConnectionIcon />, jotaiStore);
    expect(screen.getByTestId("connection-status")).toHaveAttribute(
      "data-status",
      "Connected"
    );
  });
});

describe("when registering a user name", () => {
  it("connects to the lobby as a registered user with the new name", () => {
    const { jotaiStore, transport } = createSignalRApp({
      user: { id: "user-1" },
      lobby: { joiningLobbyId: "abcd" },
    });
    jotaiStore.set(setUserNameAtom, "Alice");
    expect(transport.connectToLobby).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "user-1",
        name: "Alice",
        isRegistered: true,
      }),
      "abcd"
    );
  });
});

describe("when reconnecting with a server-side identity", () => {
  it("uses the reconnected identity for subsequent lobby actions", () => {
    const { jotaiStore, emit, transport } = createSignalRApp({
      user: { isRegistered: true },
      lobby: { joiningLobbyId: "new-lobby" },
      connectionStatus: ConnectionStatus.Connected,
    });
    emit("reconnect", {
      lobbyId: "new-lobby",
      playerId: "player-9",
      playerName: "Bob",
      players: [],
      currentGame: "poll",
      isRegistered: true,
    });
    jotaiStore.set(createLobbyAtom, "My lobby");
    expect(transport.createLobby).toHaveBeenCalledWith(
      "My lobby",
      expect.objectContaining({ id: "player-9", name: "Bob" })
    );
  });
});

describe("when navigating to the default url", () => {
  describe("when joining a lobby unregistered", () => {
    it("navigates to register", () => {
      const { jotaiStore } = createSignalRApp({
        user: { isRegistered: false },
        lobby: { joiningLobbyId: "abcd" },
      });
      const paths = listenForNavigation();
      jotaiStore.set(goToDefaultUrlAtom);
      expect(paths).toEqual(["/register"]);
    });
  });

  describe("when registered with a game in progress", () => {
    it("navigates to the game", () => {
      const { jotaiStore } = createSignalRApp({
        user: { isRegistered: true },
        lobby: { joiningLobbyId: "abcd", currentGame: "poll" },
      });
      const paths = listenForNavigation();
      jotaiStore.set(goToDefaultUrlAtom);
      expect(paths).toEqual(["/game"]);
    });
  });
});

describe("when the server closes the lobby", () => {
  it("clears the lobby and navigates to lobby-closed", () => {
    const { jotaiStore, emit } = createSignalRApp({
      lobby: { id: "abcd", name: "My Lobby", isPresenter: true },
    });
    const paths = listenForNavigation();
    emit("closelobby");
    expect(jotaiStore.get(lobbyAtom)).toEqual(initialLobbyState);
    expect(paths).toEqual(["/lobby-closed"]);
  });
});
