import { render } from "@testing-library/react";
import { createTheme } from "@mui/material";
import { ThemeProvider } from "@mui/styles";
import { Provider as JotaiProvider, createStore } from "jotai";
import { MemoryRouter } from "react-router";
import { ReactElement } from "react";
import { ConnectionStatus } from "../ConnectionStatus";
import { NavigationHandler } from "../components/NavigationHandler";
import { initializeMockSignalR } from "./jotai/signalRTestHelpers";
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
  const signalR = initializeMockSignalR(jotaiStore);

  const result = render(
    <ThemeProvider theme={createTheme({})}>
      <JotaiProvider store={jotaiStore}>
        <MemoryRouter initialEntries={[options.route ?? "/"]}>
          <NavigationHandler />
          {ui}
        </MemoryRouter>
      </JotaiProvider>
    </ThemeProvider>
  );

  return { ...result, ...signalR, jotaiStore, user };
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
