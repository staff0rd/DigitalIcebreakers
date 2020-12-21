import { MiddlewareAPI, Dispatch } from "@reduxjs/toolkit";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import {
  CONNECTION_CONNECT,
  SET_CONNECTION_STATUS,
  SET_GAME_MESSAGE_CALLBACK,
  ConnectionActionTypes,
} from "./connection/types";
import {
  updateConnectionStatus,
  connectionConnect,
} from "./connection/actions";
import ReactAI from "../app-insights-deprecated";
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
import { setDesiredLobbyId, setUser } from "./user/actions";
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
  SET_LOBBY,
} from "./lobby/types";
import { SET_USER_NAME, UserActionTypes } from "./user/types";
import { goToDefaultUrl, setMenuItems } from "./shell/actions";
import { GO_TO_DEFAULT_URL, ShellActionTypes } from "./shell/types";

const navigateTo = (path: string) => {
  console.log(`Navigating to ${path}`);
  history.push(path);
};

export const SignalRMiddleware = () => {
  const connectionRetrySeconds = [0, 1, 4, 9, 16, 25, 36, 49];
  let connectionStarted: Date;
  let connectionTimeout = 0;
  const connection: HubConnection = new HubConnectionBuilder()
    .withUrl("/gameHub")
    .build();
  connection.keepAliveIntervalInMilliseconds = 2000;
  const bumpConnectionTimeout = () => {
    connectionTimeout = connectionRetrySeconds.filter(
      (s) => s > connectionTimeout
    )[0];
    if (!connectionTimeout)
      connectionTimeout =
        connectionRetrySeconds[connectionRetrySeconds.length - 1];
  };
  const getDuration = (from: Date, to: Date = new Date()) => {
    return to.valueOf() - from.valueOf();
  };
  return ({ getState, dispatch }: MiddlewareAPI) => {
    connection.on("reconnect", (response) => {
      ReactAI.ai().trackMetric(
        "userReconnected",
        getDuration(connectionStarted)
      );
      let user = getState().user;
      if (response.playerId) {
        user = {
          id: response.playerId,
          name: response.playerName,
        };
      }
      dispatch(updateConnectionStatus(ConnectionStatus.Connected));
      if (!getState().user.isJoining) {
        dispatch(
          setLobby(
            response.lobbyId,
            response.lobbyName,
            response.isAdmin,
            response.players,
            response.currentGame
          )
        );
        dispatch(setUser(user));
        if (response.currentGame) {
          dispatch(setLobbyGame(response.currentGame));
        } else {
          dispatch(goToDefaultUrl());
        }
      }
    });
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
      ReactAI.ai().trackEvent("Connection closed");
      dispatch(updateConnectionStatus(ConnectionStatus.NotConnected));
    });
    connection.on("closelobby", () => {
      ReactAI.ai().trackEvent("Lobby closed");
      dispatch(clearLobby());
    });
    connection.on("connected", () => {
      ReactAI.ai().trackMetric(
        "userConnected",
        getDuration(connectionStarted!)
      );
      dispatch(updateConnectionStatus(ConnectionStatus.Connected));
    });
    connection.on("newgame", (name) => {
      ReactAI.ai().trackEvent("Joining new game");
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
        case SET_GAME_MESSAGE_CALLBACK: {
          connection.off("gameMessage");
          connection.on("gameMessage", (args: any) => {
            console.log("gameMessage: ", args);
            action.callback(args);
          });
          return;
        }
        case CLEAR_LOBBY: {
          navigateTo("/lobby-closed");
          break;
        }
        case START_NEW_GAME: {
          invoke("newGame", action.name);
          break;
        }
        case SET_LOBBY_GAME: {
          const isAdmin = getState().lobby.isAdmin;
          connection.on("gameMessage", (args: any) => {
            dispatch({
              type: `${action.game}-${
                isAdmin ? "presenter" : "client"
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
              connectionStarted = new Date();
              dispatch(updateConnectionStatus(ConnectionStatus.Pending));
              connection
                .start()
                .then(() => {
                  connectionTimeout = 0;
                  ReactAI.ai().trackMetric(
                    "connected",
                    getDuration(connectionStarted)
                  );
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
          switch (action.status) {
            case ConnectionStatus.NotConnected:
              dispatch(connectionConnect());
              break;
            case ConnectionStatus.Connected: {
              const { user } = getState();
              if (user.desiredLobbyId) {
                dispatch(joinLobby(user.desiredLobbyId));
              } else dispatch(goToDefaultUrl());
              break;
            }
          }
          break;
        }
        case SET_USER_NAME: {
          const value = next(action);
          const { user, lobby } = getState();
          console.warn("connecting: ", JSON.stringify(user));
          invoke("connectToLobby", user, lobby.id);
          return value;
        }
        case JOIN_LOBBY: {
          if (getState().connection.status === ConnectionStatus.Connected) {
            invoke("connectToLobby", getState().user, action.id);
          } else {
            dispatch(setDesiredLobbyId(action.id));
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
          if (user.isJoining && !user.isRegistered) {
            console.log("pushing register", lobby.isAdmin, user.isRegistered);
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
        case SET_LOBBY: {
          dispatch(setDesiredLobbyId(undefined));
          break;
        }
      }
      return next(action);
    };
  };
};
