import { render, screen } from "@testing-library/react";
import { createTheme } from "@mui/material";
import { ThemeProvider } from "@mui/styles";
import { Provider as JotaiProvider, createStore } from "jotai";
import { AnyAction } from "redux";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ConnectionStatus } from "ConnectionStatus";
import { ConnectionIcon } from "../components/ConnectionIcon";
import { updateConnectionStatus } from "./connection/actions";
import { setUserName } from "./user/actions";
import { UserState } from "./user/types";
import { createLobby, joinLobby } from "./lobby/actions";
import { LobbyState, SET_LOBBY } from "./lobby/types";
import { goToDefaultUrl, navigate } from "./shell/actions";
import { ConnectionActionTypes } from "./connection/types";
import { RootState } from "./RootState";
import {
  SignalRMiddlewareWithJotai,
  onReconnect,
  setJotaiStore,
} from "./SignalRMiddlewareWithJotai";
import { userAtom } from "./atoms/userAtoms";
import { connectionStatusAtom } from "./atoms/connectionAtoms";

const connectionFactory = vi.fn();
const mockConnection = {
  on: vi.fn(),
  off: vi.fn(),
  onclose: vi.fn(),
  start: vi.fn(() => Promise.resolve()),
  invoke: vi.fn(() => Promise.resolve()),
  emit: (eventName: string, payload?: any) => {
    const callback = mockConnection.on.mock.calls.find(
      (call) => call[0] === eventName
    );
    callback && callback[1](payload);
  },
};
const dispatch = vi.fn();

type MiddlewareOptions = {
  user?: Partial<UserState>;
  lobby?: Partial<LobbyState>;
  connectionStatus?: ConnectionStatus;
};

const createMiddleware = (options: MiddlewareOptions = {}) => {
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
  setJotaiStore(jotaiStore);
  const store = {
    getState: vi.fn(() => ({ lobby: options.lobby } as RootState)),
    dispatch,
  };
  const next = vi.fn();

  const invoke = (action: AnyAction) =>
    SignalRMiddlewareWithJotai(connectionFactory)(store)(next)(
      action as ConnectionActionTypes
    );

  return { store, next, invoke, jotaiStore };
};

describe("SignalRMiddlewareWithJotai", () => {
  beforeEach(() => {
    connectionFactory.mockClear();
    mockConnection.on.mockClear();
    mockConnection.off.mockClear();
    mockConnection.onclose.mockClear();
    mockConnection.invoke.mockClear();
    dispatch.mockClear();
    connectionFactory.mockReturnValue(mockConnection);
  });

  describe("when joining a lobby", () => {
    describe("when not yet registered", () => {
      describe("when player", () => {
        it("should not set lobby", () => {
          const { invoke } = createMiddleware({
            user: { isRegistered: false },
            lobby: { joiningLobbyId: "new-lobby" } as LobbyState,
            connectionStatus: ConnectionStatus.Connected,
          });
          invoke({} as AnyAction);
          mockConnection.emit("reconnect", {
            lobbyId: "new-lobby",
          });
          expect(dispatch).not.toBeCalledWith(
            expect.objectContaining({
              type: SET_LOBBY,
            })
          );
        });
      });
      describe("when presenter", () => {
        it("should set lobby", () => {
          const { invoke } = createMiddleware({
            user: { isRegistered: false },
            lobby: {
              joiningLobbyId: "new-lobby",
              isPresenter: true,
            } as LobbyState,
            connectionStatus: ConnectionStatus.Connected,
          });
          invoke({} as AnyAction);
          mockConnection.emit("reconnect", {
            lobbyId: "new-lobby",
          });
          expect(dispatch).toBeCalledWith(
            expect.objectContaining({
              type: SET_LOBBY,
            })
          );
        });
      });
    });
  });

  describe("when connected to an old lobby", () => {
    it("should not update to old lobby", () => {
      const { invoke } = createMiddleware({
        lobby: { joiningLobbyId: "new-lobby" } as LobbyState,
        connectionStatus: ConnectionStatus.Connected,
      });
      invoke({} as AnyAction);
      mockConnection.emit("reconnect", {
        lobbyId: "old-lobby",
      });
      expect(dispatch).not.toBeCalledWith(
        expect.objectContaining({
          type: SET_LOBBY,
        })
      );
    });
  });

  describe("when connection achieved", () => {
    describe("when is joining lobby", () => {
      it("should join lobby", () => {
        const { invoke } = createMiddleware({
          lobby: { joiningLobbyId: "some-lobby" } as LobbyState,
          connectionStatus: ConnectionStatus.Connected,
        });
        invoke(updateConnectionStatus(ConnectionStatus.Connected));
        expect(dispatch).toHaveBeenCalledWith(joinLobby("some-lobby"));
      });
    });

    it("shows the user as connected", () => {
      const { invoke, jotaiStore } = createMiddleware({
        lobby: {} as LobbyState,
      });
      invoke(updateConnectionStatus(ConnectionStatus.Connected));
      render(
        <ThemeProvider theme={createTheme({})}>
          <JotaiProvider store={jotaiStore}>
            <ConnectionIcon />
          </JotaiProvider>
        </ThemeProvider>
      );
      expect(screen.getByTestId("connection-status")).toHaveAttribute(
        "data-status",
        "Connected"
      );
    });
  });

  describe("when registering a user name", () => {
    it("connects to the lobby as a registered user with the new name", () => {
      const { invoke } = createMiddleware({
        user: { id: "user-1" },
        lobby: { joiningLobbyId: "abcd" } as LobbyState,
      });
      invoke(setUserName("Alice"));
      expect(mockConnection.invoke).toHaveBeenCalledWith(
        "connectToLobby",
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
      const { invoke } = createMiddleware({
        user: { isRegistered: true },
        lobby: { joiningLobbyId: "new-lobby" } as LobbyState,
        connectionStatus: ConnectionStatus.Connected,
      });
      invoke({} as AnyAction);
      mockConnection.emit("reconnect", {
        lobbyId: "new-lobby",
        playerId: "player-9",
        playerName: "Bob",
        players: [],
        currentGame: "poll",
        isRegistered: true,
      });
      invoke(createLobby("My lobby"));
      expect(mockConnection.invoke).toHaveBeenCalledWith(
        "createLobby",
        "My lobby",
        expect.objectContaining({ id: "player-9", name: "Bob" })
      );
    });
  });

  describe("when navigating to the default url", () => {
    describe("when joining a lobby unregistered", () => {
      it("navigates to register", () => {
        const { invoke } = createMiddleware({
          user: { isRegistered: false },
          lobby: { joiningLobbyId: "abcd" } as LobbyState,
        });
        invoke(goToDefaultUrl());
        expect(dispatch).toHaveBeenCalledWith(navigate("/register"));
      });
    });

    describe("when registered with a game in progress", () => {
      it("navigates to the game", () => {
        const { invoke } = createMiddleware({
          user: { isRegistered: true },
          lobby: {
            joiningLobbyId: "abcd",
            currentGame: "poll",
          } as LobbyState,
        });
        invoke(goToDefaultUrl());
        expect(dispatch).toHaveBeenCalledWith(navigate("/game"));
      });
    });
  });
});

describe("onReconnect", () => {
  describe("when joining lobby", () => {
    it("should allow case insensitive join code", () => {
      const localDispatch = vi.fn();
      const jotaiStore = createStore();
      jotaiStore.set(userAtom, {
        id: "user-1",
        name: "",
        isRegistered: true,
      });
      jotaiStore.set(connectionStatusAtom, ConnectionStatus.Connected);
      setJotaiStore(jotaiStore);
      onReconnect(
        () =>
          ({
            lobby: {
              joiningLobbyId: "aaaa",
            },
          } as RootState),
        localDispatch
      )({
        lobbyId: "AAAA",
        playerId: "player-1",
        playerName: "Bob",
        players: [],
        currentGame: "",
        isRegistered: true,
        lobbyName: "lobby",
        isPresenter: false,
      });
      const setLobbyAction = localDispatch.mock.calls.find(
        (call) => call[0].type === "SET_LOBBY"
      );
      expect(setLobbyAction).not.toBeUndefined();
      expect(setLobbyAction![0].id).toBe("AAAA");
    });
  });
});
