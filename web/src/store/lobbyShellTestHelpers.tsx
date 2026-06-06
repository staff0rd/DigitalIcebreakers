import { render, act } from "@testing-library/react";
import { createTheme } from "@mui/material";
import { ThemeProvider } from "@mui/styles";
import { Provider as JotaiProvider, createStore } from "jotai";
import { Provider as ReduxProvider } from "react-redux";
import { AnyAction, configureStore, Middleware } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router";
import { ReactElement } from "react";
import { vi } from "vitest";
import { ConnectionStatus } from "../ConnectionStatus";
import { NavigationHandler } from "../components/NavigationHandler";
import { rootReducer } from "./rootReducer";
import { navigationMiddleware } from "./navigationMiddleware";
import {
  SignalRMiddlewareWithJotai,
  setJotaiStore,
} from "./SignalRMiddlewareWithJotai";
import { userAtom } from "./atoms/userAtoms";
import { connectionStatusAtom } from "./atoms/connectionAtoms";
import { UserState } from "./user/types";

type RenderLobbyAppOptions = {
  user?: Partial<UserState>;
  connectionStatus?: ConnectionStatus;
  route?: string;
};

export const renderLobbyApp = (
  ui: ReactElement,
  options: RenderLobbyAppOptions = {}
) => {
  const connection = {
    on: vi.fn(),
    off: vi.fn(),
    onclose: vi.fn(),
    start: vi.fn(() => Promise.resolve()),
    invoke: vi.fn(() => Promise.resolve()),
  };

  const jotaiStore = createStore();
  const user: UserState = {
    id: "user-1",
    name: "Tester",
    isRegistered: true,
    ...options.user,
  };
  jotaiStore.set(userAtom, user);
  jotaiStore.set(
    connectionStatusAtom,
    options.connectionStatus ?? ConnectionStatus.Connected
  );
  setJotaiStore(jotaiStore);

  const actions: AnyAction[] = [];
  const actionRecorder: Middleware = () => (next) => (action) => {
    actions.push(action as AnyAction);
    return next(action);
  };
  const reduxStore = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat([
        actionRecorder,
        navigationMiddleware,
        SignalRMiddlewareWithJotai(() => connection as never),
      ]),
  });

  const emit = (eventName: string, payload?: unknown) => {
    const calls = connection.on.mock.calls.filter(
      (call) => call[0] === eventName
    );
    const handler = calls[calls.length - 1]?.[1];
    act(() => handler?.(payload));
  };

  const result = render(
    <ThemeProvider theme={createTheme({})}>
      <ReduxProvider store={reduxStore}>
        <JotaiProvider store={jotaiStore}>
          <MemoryRouter initialEntries={[options.route ?? "/"]}>
            <NavigationHandler />
            {ui}
          </MemoryRouter>
        </JotaiProvider>
      </ReduxProvider>
    </ThemeProvider>
  );

  return { ...result, connection, emit, actions, jotaiStore, reduxStore, user };
};

type ReconnectOverrides = {
  lobbyId?: string;
  lobbyName?: string;
  isPresenter?: boolean;
  players?: { id: string; name: string }[];
  currentGame?: string;
  playerId?: string;
  playerName?: string;
  isRegistered?: boolean;
};

export const createReconnectPayload = (
  overrides: ReconnectOverrides = {}
) => ({
  lobbyId: "abcd",
  lobbyName: "My Lobby",
  isPresenter: true,
  players: [],
  currentGame: "",
  playerId: "user-1",
  playerName: "Tester",
  isRegistered: true,
  ...overrides,
});
