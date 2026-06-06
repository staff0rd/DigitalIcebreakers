import { HubConnection } from "@microsoft/signalr";
import {
  CONNECTION_CONNECT,
  SET_CONNECTION_STATUS,
  ConnectionActionTypes,
  ReconnectPayload,
} from "./connection/types";
import {
  updateConnectionStatus,
  connectionConnect,
} from "./connection/actions";
import { ConnectionStatus } from "../ConnectionStatus";
import { clearLobby, setLobbyGame, joinLobby } from "./lobby/actions";
import {
  CLEAR_LOBBY,
  SET_LOBBY_GAME,
  START_NEW_GAME,
  JOIN_LOBBY,
  CLOSE_LOBBY,
  CREATE_LOBBY,
  GAME_MESSAGE_CLIENT,
  GAME_MESSAGE_PRESENTER,
  LobbyActionTypes,
} from "./lobby/types";
import { SET_USER_NAME, UserActionTypes } from "./user/types";
import { goToDefaultUrl, navigate } from "./shell/actions";
import { GO_TO_DEFAULT_URL, ShellActionTypes } from "./shell/types";
import { getGameHandler, isGameRegistered } from "./jotai/gameMessageHandlers";
import { userAtom } from "./atoms/userAtoms";
import { connectionStatusAtom } from "./atoms/connectionAtoms";
import {
  lobbyAtom,
  initialLobbyState,
  playerJoinedAtom,
  playerLeftAtom,
} from "./atoms/lobbyAtoms";

type JotaiStore = ReturnType<typeof import("jotai").createStore>;

type Dispatch = (action: unknown) => unknown;

let jotaiStoreRef: JotaiStore | null = null;

export const setJotaiStore = (store: JotaiStore) => {
  jotaiStoreRef = store;
};

const jotai = (): JotaiStore => {
  if (!jotaiStoreRef) {
    throw new Error("Jotai store has not been set");
  }
  return jotaiStoreRef;
};

export const onReconnect =
  (dispatch: Dispatch) => (response: ReconnectPayload) => {
    const user = jotai().get(userAtom);
    const { joiningLobbyId, isPresenter } = jotai().get(lobbyAtom);
    if (jotai().get(connectionStatusAtom) !== ConnectionStatus.Connected) {
      dispatch(updateConnectionStatus(ConnectionStatus.Connected));
    }
    if (
      !joiningLobbyId ||
      joiningLobbyId.toLowerCase() === response.lobbyId.toLowerCase()
    ) {
      if (!user.isRegistered && !isPresenter && !response.isRegistered) {
        dispatch(goToDefaultUrl());
      } else {
        jotai().set(lobbyAtom, {
          id: response.lobbyId,
          name: response.lobbyName,
          isPresenter: response.isPresenter,
          currentGame: response.currentGame,
          players: response.players,
        });
        jotai().set(userAtom, {
          ...user,
          id: response.playerId,
          name: response.playerName,
        });

        if (response.currentGame) {
          dispatch(setLobbyGame(response.currentGame));
        } else {
          dispatch(goToDefaultUrl());
        }
      }
    }
  };

export const SignalRMiddlewareWithJotai = (connectionFactory: () => HubConnection) => {
  const connectionRetrySeconds = [0, 1, 4, 9, 16, 25, 36, 49];
  let connectionTimeout = 0;
  const connection = connectionFactory();
  const bumpConnectionTimeout = () => {
    connectionTimeout = connectionRetrySeconds.filter(
      (s) => s > connectionTimeout
    )[0];
    if (!connectionTimeout)
      connectionTimeout =
        connectionRetrySeconds[connectionRetrySeconds.length - 1];
  };

  return ({ dispatch }) => {
    connection.on("reconnect", onReconnect(dispatch));
    connection.on("joined", (user) => {
      jotai().set(playerJoinedAtom, user);
    });
    connection.on("left", (user) => {
      jotai().set(playerLeftAtom, user);
    });
    connection.on("players", (players) => {
      jotai().set(lobbyAtom, { ...jotai().get(lobbyAtom), players });
    });
    connection.onclose(() => {
      dispatch(updateConnectionStatus(ConnectionStatus.NotConnected));
    });
    connection.on("closelobby", () => {
      dispatch(clearLobby());
    });
    connection.on("connected", () => {
      dispatch(updateConnectionStatus(ConnectionStatus.Connected));
    });
    connection.on("newgame", (name) => {
      connection.off("gameMessage");
      dispatch(setLobbyGame(name));
    });
    const invoke = (methodName: string, ...params: any[]) => {
      connection.invoke(methodName, ...params).catch((err) => console.log(err));
    };
    return (next) =>
      (
        action:
          | LobbyActionTypes
          | ConnectionActionTypes
          | UserActionTypes
          | ShellActionTypes
      ) => {
        switch (action.type) {
          case CLEAR_LOBBY: {
            jotai().set(lobbyAtom, initialLobbyState);
            dispatch(navigate("/lobby-closed"));
            break;
          }
          case START_NEW_GAME: {
            invoke("newGame", action.name);
            break;
          }
          case SET_LOBBY_GAME: {
            jotai().set(lobbyAtom, {
              ...jotai().get(lobbyAtom),
              currentGame: action.game,
            });
            const isPresenter = jotai().get(lobbyAtom).isPresenter;
            connection.off("gameMessage");
            connection.on("gameMessage", (args: any) => {
              if (isGameRegistered(action.game)) {
                const gameHandler = getGameHandler(action.game);
                if (gameHandler) {
                  const { atom, messageHandler } = gameHandler;
                  const currentState = jotai().get(atom);
                  const newState = messageHandler(
                    currentState,
                    args,
                    isPresenter
                  );
                  jotai().set(atom, newState);
                }
              }
            });
            const value = next(action);
            dispatch(goToDefaultUrl());
            return value;
          }
          case CONNECTION_CONNECT: {
            setTimeout(() => {
              if (
                jotai().get(connectionStatusAtom) ===
                ConnectionStatus.NotConnected
              ) {
                bumpConnectionTimeout();
                dispatch(updateConnectionStatus(ConnectionStatus.Pending));
                connection
                  .start()
                  .then(() => {
                    connectionTimeout = 0;
                    connection
                      .invoke("connect", jotai().get(userAtom), action.lobbyId)
                      .catch(() => {
                        dispatch(connectionConnect(action.lobbyId));
                      });
                  })
                  .catch((err) => {
                    dispatch(
                      updateConnectionStatus(ConnectionStatus.NotConnected)
                    );
                    dispatch(connectionConnect(action.lobbyId));
                    return console.error(err.toString());
                  });
              }
            }, connectionTimeout * 1000);
            break;
          }
          case SET_CONNECTION_STATUS: {
            jotai().set(connectionStatusAtom, action.status);
            const value = next(action);
            switch (action.status) {
              case ConnectionStatus.NotConnected:
                dispatch(connectionConnect());
                break;
              case ConnectionStatus.Connected: {
                const lobby = jotai().get(lobbyAtom);
                if (lobby.joiningLobbyId) {
                  dispatch(joinLobby(lobby.joiningLobbyId));
                } else if (lobby.id) dispatch(joinLobby(lobby.id));
                else dispatch(goToDefaultUrl());
                break;
              }
            }
            return value;
          }
          case SET_USER_NAME: {
            const user = {
              ...jotai().get(userAtom),
              name: action.name,
              isRegistered: true,
            };
            jotai().set(userAtom, user);
            const value = next(action);
            const lobby = jotai().get(lobbyAtom);
            invoke("connectToLobby", user, lobby.id || lobby.joiningLobbyId);
            return value;
          }
          case JOIN_LOBBY: {
            jotai().set(lobbyAtom, {
              ...jotai().get(lobbyAtom),
              joiningLobbyId: action.id,
            });
            if (
              jotai().get(connectionStatusAtom) === ConnectionStatus.Connected
            ) {
              invoke("connectToLobby", jotai().get(userAtom), action.id);
            }
            break;
          }
          case CLOSE_LOBBY: {
            invoke("closelobby");
            break;
          }
          case CREATE_LOBBY: {
            jotai().set(lobbyAtom, {
              ...jotai().get(lobbyAtom),
              isPresenter: true,
              name: action.name,
            });
            invoke("createLobby", action.name, jotai().get(userAtom));
            break;
          }
          case GAME_MESSAGE_PRESENTER: {
            const payload = JSON.stringify({ admin: action.message });
            invoke("hubMessage", payload);
            break;
          }
          case GAME_MESSAGE_CLIENT: {
            const payload = JSON.stringify({ client: action.message });
            invoke("hubMessage", payload);
            break;
          }
          case GO_TO_DEFAULT_URL: {
            const user = jotai().get(userAtom);
            const lobby = jotai().get(lobbyAtom);
            if (lobby.joiningLobbyId && !user.isRegistered) {
              console.log("navigating to register");
              dispatch(navigate("/register"));
            } else {
              if (lobby.currentGame) {
                console.log("navigating to game");
                dispatch(navigate("/game"));
              } else {
                console.log("navigating to home");
                dispatch(navigate("/"));
              }
            }
            break;
          }
        }
        return next(action);
      };
  };
};
