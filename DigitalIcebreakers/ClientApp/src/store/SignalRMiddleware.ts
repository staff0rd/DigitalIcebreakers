import { MiddlewareAPI, Dispatch, AnyAction } from "@reduxjs/toolkit";
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
import {
  setLobby,
  clearLobby,
  playerJoinedLobby,
  playerLeftLobby,
  setLobbyGame,
  setLobbyPlayers,
  joinLobby,
} from "./lobby/actions";
import { setUser } from "./user/actions";
import history from "../history";
import {
  CLEAR_LOBBY,
  SET_LOBBY_GAME,
  START_NEW_GAME,
  JOIN_LOBBY,
  CLOSE_LOBBY,
  CREATE_LOBBY,
  GAME_MESSAGE_CLIENT,
  GAME_MESSAGE_ADMIN,
  LobbyActionTypes,
} from "./lobby/types";
import { SET_USER_NAME, UserActionTypes } from "./user/types";
import { goToDefaultUrl, setMenuItems } from "./shell/actions";
import { GO_TO_DEFAULT_URL, ShellActionTypes } from "./shell/types";
import { RootState } from "./RootState";

const navigateTo = (path: string) => {
  console.log(`Navigating to ${path}`);
  history.push(path);
};

export const onReconnect = (
  getState: () => RootState,
  dispatch: Dispatch<AnyAction>
) => (response: ReconnectPayload) => {
  const user = getState().user;
  const { joiningLobbyId, isPresenter } = getState().lobby;
  if (getState().connection.status !== ConnectionStatus.Connected) {
    dispatch(updateConnectionStatus(ConnectionStatus.Connected));
  }
  if (
    !joiningLobbyId ||
    joiningLobbyId.toLowerCase() === response.lobbyId.toLowerCase()
  ) {
    if (!user.isRegistered && !isPresenter && !response.isRegistered) {
      dispatch(goToDefaultUrl());
    } else {
      dispatch(
        setLobby(
          response.lobbyId,
          response.lobbyName,
          response.isPresenter,
          response.players,
          response.currentGame
        )
      );
      dispatch(
        setUser({
          id: response.playerId,
          name: response.playerName,
        })
      );

      if (response.currentGame) {
        dispatch(setLobbyGame(response.currentGame));
      } else {
        dispatch(goToDefaultUrl());
      }
    }
  }
};

export const SignalRMiddleware = (connectionFactory: () => HubConnection) => {
  const connectionRetrySeconds = [0, 1, 4, 9, 16, 25, 36, 49];
  let connectionTimeout = 0;
  const connection = connectionFactory();
  connection.keepAliveIntervalInMilliseconds = 2000;
  const bumpConnectionTimeout = () => {
    connectionTimeout = connectionRetrySeconds.filter(
      (s) => s > connectionTimeout
    )[0];
    if (!connectionTimeout)
      connectionTimeout =
        connectionRetrySeconds[connectionRetrySeconds.length - 1];
  };

  return ({ getState, dispatch }: MiddlewareAPI<Dispatch, RootState>) => {
    connection.on("reconnect", onReconnect(getState, dispatch));
    connection.on("joined", (user) => {
      dispatch(playerJoinedLobby(user));
    });
    connection.on("left", (user) => {
      dispatch(playerLeftLobby(user));
    });
    connection.on("players", (players) => {
      dispatch(setLobbyPlayers(players));
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
      dispatch(setMenuItems([]));
      dispatch(setLobbyGame(name));
    });
    const invoke = (methodName: string, ...params: any[]) => {
      connection.invoke(methodName, ...params).catch((err) => console.log(err));
    };
    return (next: Dispatch) => (
      action:
        | LobbyActionTypes
        | ConnectionActionTypes
        | UserActionTypes
        | ShellActionTypes
    ) => {
      switch (action.type) {
        case CLEAR_LOBBY: {
          navigateTo("/lobby-closed");
          break;
        }
        case START_NEW_GAME: {
          invoke("newGame", action.name);
          break;
        }
        case SET_LOBBY_GAME: {
          const isPresenter = getState().lobby.isPresenter;
          connection.off("gameMessage");
          connection.on("gameMessage", (args: any) => {
            dispatch({
              type: `${action.game}-${
                isPresenter ? "presenter" : "client"
              }-receive-game-message`,
              payload: args,
            });
          });
          const value = next(action);
          dispatch(goToDefaultUrl());
          return value;
        }
        case CONNECTION_CONNECT: {
          setTimeout(() => {
            if (
              getState().connection.status === ConnectionStatus.NotConnected
            ) {
              bumpConnectionTimeout();
              dispatch(updateConnectionStatus(ConnectionStatus.Pending));
              connection
                .start()
                .then(() => {
                  connectionTimeout = 0;
                  connection
                    .invoke("connect", getState().user, action.lobbyId)
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
          const value = next(action);
          switch (action.status) {
            case ConnectionStatus.NotConnected:
              dispatch(connectionConnect());
              break;
            case ConnectionStatus.Connected: {
              const { lobby } = getState();
              if (lobby.joiningLobbyId) {
                dispatch(joinLobby(lobby.joiningLobbyId));
              } else dispatch(goToDefaultUrl());
              break;
            }
          }
          return value;
        }
        case SET_USER_NAME: {
          const value = next(action);
          const { user, lobby } = getState();
          invoke("connectToLobby", user, lobby.id || lobby.joiningLobbyId);
          return value;
        }
        case JOIN_LOBBY: {
          if (getState().connection.status === ConnectionStatus.Connected) {
            invoke("connectToLobby", getState().user, action.id);
          }
          break;
        }
        case CLOSE_LOBBY: {
          invoke("closelobby");
          break;
        }
        case CREATE_LOBBY: {
          invoke("createLobby", action.name, getState().user);
          break;
        }
        case GAME_MESSAGE_ADMIN: {
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
          const { user, lobby } = getState();
          if (lobby.joiningLobbyId && !user.isRegistered) {
            navigateTo("/register");
          } else {
            const currentGame = getState().lobby.currentGame;
            if (currentGame) {
              navigateTo("/game");
            } else {
              navigateTo("/");
            }
          }
          break;
        }
      }
      return next(action);
    };
  };
};
