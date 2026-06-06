import { HubConnection } from "@microsoft/signalr";
import { atom, createStore } from "jotai";
import { ConnectionStatus } from "../../ConnectionStatus";
import { ReconnectPayload } from "../connection/types";
import { userAtom } from "../atoms/userAtoms";
import { connectionStatusAtom } from "../atoms/connectionAtoms";
import {
  lobbyAtom,
  initialLobbyState,
  playerJoinedAtom,
  playerLeftAtom,
} from "../atoms/lobbyAtoms";
import { getGameHandler, isGameRegistered } from "./gameMessageHandlers";

type JotaiStore = ReturnType<typeof createStore>;

let storeRef: JotaiStore | null = null;
let connectionRef: HubConnection | null = null;

const store = (): JotaiStore => {
  if (!storeRef) {
    throw new Error("SignalR has not been initialized");
  }
  return storeRef;
};

const connection = (): HubConnection => {
  if (!connectionRef) {
    throw new Error("SignalR has not been initialized");
  }
  return connectionRef;
};

const invoke = (methodName: string, ...params: any[]) => {
  connection()
    .invoke(methodName, ...params)
    .catch((err) => console.log(err));
};

const connectionRetrySeconds = [0, 1, 4, 9, 16, 25, 36, 49];
let connectionTimeout = 0;

const bumpConnectionTimeout = () => {
  connectionTimeout = connectionRetrySeconds.filter(
    (s) => s > connectionTimeout
  )[0];
  if (!connectionTimeout)
    connectionTimeout =
      connectionRetrySeconds[connectionRetrySeconds.length - 1];
};

export const navigateAtom = atom(null, (_get, _set, path: string) => {
  window.dispatchEvent(
    new CustomEvent("navigate-action", { detail: { path } })
  );
});

export const goToDefaultUrlAtom = atom(null, (get, set) => {
  const user = get(userAtom);
  const lobby = get(lobbyAtom);
  if (lobby.joiningLobbyId && !user.isRegistered) {
    set(navigateAtom, "/register");
  } else if (lobby.currentGame) {
    set(navigateAtom, "/game");
  } else {
    set(navigateAtom, "/");
  }
});

export const clearLobbyAtom = atom(null, (_get, set) => {
  set(lobbyAtom, initialLobbyState);
  set(navigateAtom, "/lobby-closed");
});

export const setLobbyGameAtom = atom(null, (get, set, game: string) => {
  set(lobbyAtom, { ...get(lobbyAtom), currentGame: game });
  const isPresenter = get(lobbyAtom).isPresenter;
  connection().off("gameMessage");
  connection().on("gameMessage", (args: any) => {
    if (isGameRegistered(game)) {
      const gameHandler = getGameHandler(game);
      if (gameHandler) {
        const { atom: gameAtom, messageHandler } = gameHandler;
        const currentState = store().get(gameAtom);
        store().set(gameAtom, messageHandler(currentState, args, isPresenter));
      }
    }
  });
  set(goToDefaultUrlAtom);
});

export const connectionConnectAtom = atom(
  null,
  (_get, _set, lobbyId?: string) => {
    setTimeout(() => {
      if (store().get(connectionStatusAtom) === ConnectionStatus.NotConnected) {
        bumpConnectionTimeout();
        store().set(updateConnectionStatusAtom, ConnectionStatus.Pending);
        connection()
          .start()
          .then(() => {
            connectionTimeout = 0;
            connection()
              .invoke("connect", store().get(userAtom), lobbyId)
              .catch(() => {
                store().set(connectionConnectAtom, lobbyId);
              });
          })
          .catch((err) => {
            store().set(
              updateConnectionStatusAtom,
              ConnectionStatus.NotConnected
            );
            store().set(connectionConnectAtom, lobbyId);
            return console.error(err.toString());
          });
      }
    }, connectionTimeout * 1000);
  }
);

export const updateConnectionStatusAtom = atom(
  null,
  (get, set, status: ConnectionStatus) => {
    set(connectionStatusAtom, status);
    switch (status) {
      case ConnectionStatus.NotConnected:
        set(connectionConnectAtom, undefined);
        break;
      case ConnectionStatus.Connected: {
        const lobby = get(lobbyAtom);
        if (lobby.joiningLobbyId) {
          set(joinLobbyAtom, lobby.joiningLobbyId);
        } else if (lobby.id) set(joinLobbyAtom, lobby.id);
        else set(goToDefaultUrlAtom);
        break;
      }
    }
  }
);

export const setUserNameAtom = atom(null, (get, set, name: string) => {
  const user = { ...get(userAtom), name, isRegistered: true };
  set(userAtom, user);
  const lobby = get(lobbyAtom);
  invoke("connectToLobby", user, lobby.id || lobby.joiningLobbyId);
});

export const joinLobbyAtom = atom(null, (get, set, id: string) => {
  set(lobbyAtom, { ...get(lobbyAtom), joiningLobbyId: id });
  if (get(connectionStatusAtom) === ConnectionStatus.Connected) {
    invoke("connectToLobby", get(userAtom), id);
  }
});

export const createLobbyAtom = atom(null, (get, set, name: string) => {
  set(lobbyAtom, { ...get(lobbyAtom), isPresenter: true, name });
  invoke("createLobby", name, get(userAtom));
});

export const closeLobbyAtom = atom(null, () => {
  invoke("closelobby");
});

export const startNewGameAtom = atom(null, (_get, _set, name: string) => {
  invoke("newGame", name);
});

export const presenterMessageAtom = atom(null, (_get, _set, message: any) => {
  invoke("hubMessage", JSON.stringify({ admin: message }));
});

export const clientMessageAtom = atom(null, (_get, _set, message: any) => {
  invoke("hubMessage", JSON.stringify({ client: message }));
});

const onReconnect = (response: ReconnectPayload) => {
  const user = store().get(userAtom);
  const { joiningLobbyId, isPresenter } = store().get(lobbyAtom);
  if (store().get(connectionStatusAtom) !== ConnectionStatus.Connected) {
    store().set(updateConnectionStatusAtom, ConnectionStatus.Connected);
  }
  if (
    !joiningLobbyId ||
    joiningLobbyId.toLowerCase() === response.lobbyId.toLowerCase()
  ) {
    if (!user.isRegistered && !isPresenter && !response.isRegistered) {
      store().set(goToDefaultUrlAtom);
    } else {
      store().set(lobbyAtom, {
        id: response.lobbyId,
        name: response.lobbyName,
        isPresenter: response.isPresenter,
        currentGame: response.currentGame,
        players: response.players,
      });
      store().set(userAtom, {
        ...user,
        id: response.playerId,
        name: response.playerName,
      });

      if (response.currentGame) {
        store().set(setLobbyGameAtom, response.currentGame);
      } else {
        store().set(goToDefaultUrlAtom);
      }
    }
  }
};

export const initializeSignalR = (
  jotaiStore: JotaiStore,
  connectionFactory: () => HubConnection
) => {
  storeRef = jotaiStore;
  connectionRef = connectionFactory();
  connectionTimeout = 0;

  connection().on("reconnect", onReconnect);
  connection().on("joined", (user) => {
    store().set(playerJoinedAtom, user);
  });
  connection().on("left", (user) => {
    store().set(playerLeftAtom, user);
  });
  connection().on("players", (players) => {
    store().set(lobbyAtom, { ...store().get(lobbyAtom), players });
  });
  connection().onclose(() => {
    store().set(updateConnectionStatusAtom, ConnectionStatus.NotConnected);
  });
  connection().on("closelobby", () => {
    store().set(clearLobbyAtom);
  });
  connection().on("connected", () => {
    store().set(updateConnectionStatusAtom, ConnectionStatus.Connected);
  });
  connection().on("newgame", (name) => {
    connection().off("gameMessage");
    store().set(setLobbyGameAtom, name);
  });
};
