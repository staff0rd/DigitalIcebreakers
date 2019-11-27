import { configureStore, getDefaultMiddleware, Middleware, MiddlewareAPI, Dispatch, AnyAction, EnhancedStore } from '@reduxjs/toolkit'
import { rootReducer } from './rootReducer'
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr'
import { CONNECTION_CONNECT, SET_CONNECTION_STATUS } from './connection/types'
import { updateConnectionStatus, connectionConnect, connectionReconnect } from './connection/actions'
import ReactAI from 'react-appinsights';
import { ConnectionStatus } from '../ConnectionStatus'
import { setLobby, clearLobby, playerJoinedLobby, playerLeftLobby, setLobbyGame } from './lobby/actions'
import { setUser } from './user/actions'
import history from '../history';
import { CLEAR_LOBBY, SET_LOBBY_GAME, START_NEW_GAME, JOIN_LOBBY, CLOSE_LOBBY, CREATE_LOBBY, GAME_MESSAGE_CLIENT, GAME_MESSAGE_ADMIN } from './lobby/types'
import { guid } from '../util/guid'

export function configureAppStore() {
  const store = configureStore({
    reducer: rootReducer,
    middleware: [
      loggerMiddleware,
      signalRMiddleware(), 
      ...getDefaultMiddleware()
    ]
  })

  // if (process.env.NODE_ENV !== 'production' && module.hot) {
  //   module.hot.accept('./reducers', () => store.replaceReducer(rootReducer))
  // }

  return store
}

const signalRMiddleware = () => {
    const connectionRetrySeconds = [0, 1, 4, 9, 16, 25, 36, 49];
    let connectionStarted: Date;
    let connectionTimeout = 0;
    const connection: HubConnection = new HubConnectionBuilder().withUrl("/gameHub").build();
    connection.keepAliveIntervalInMilliseconds = 2000;

   const bumpConnectionTimeout = () => {
        connectionTimeout = connectionRetrySeconds.filter(s => s > connectionTimeout)[0];
        if (!connectionTimeout)
            connectionTimeout = connectionRetrySeconds[connectionRetrySeconds.length-1];
    }
    const getDuration = (from: Date, to: Date = new Date()) => {
        return to.valueOf() - from.valueOf();
    }

    return ({ getState, dispatch }: MiddlewareAPI) => { 
        connection.on("reconnect", (response) => { 
            ReactAI.ai().trackMetric("userReconnected", getDuration(connectionStarted));
            
            let user = getState().user;
            
            if (response.playerId) {
                user = {
                    id: response.playerId,
                    name: response.playerName
                };
            }
            
            dispatch(updateConnectionStatus(ConnectionStatus.Connected));
            dispatch(setLobby(response.lobbyId, response.lobbyName, response.isAdmin, response.players, response.currentGame));
            dispatch(setUser(user));
        });

        connection.on("joined", (user) => {
            dispatch(playerJoinedLobby(user));        
        });

        connection.on("left", (user) => {
            dispatch(playerLeftLobby(user));
        });

        connection.onclose(() => {
            ReactAI.ai().trackEvent("Connection closed");
            dispatch(updateConnectionStatus(ConnectionStatus.NotConnected));
        });

        connection.on("closelobby", () => {
            ReactAI.ai().trackEvent("Lobby closed");
            dispatch(clearLobby())
        });

        connection.on("connected", () => {
            ReactAI.ai().trackMetric("userConnected", getDuration(connectionStarted!));
            dispatch(updateConnectionStatus(ConnectionStatus.Connected));
        });

        connection.on("newGame", (name) => {
            ReactAI.ai().trackEvent("Joining new game");
            connection.off("gameUpdate");
            dispatch(setLobbyGame(name));
        });

        return (next: Dispatch) => (action: any) => {
            switch(action.type) {
                case CLEAR_LOBBY: {
                    history.push('/lobbyClosed');
                    break;
                }
                case START_NEW_GAME: {
                    // TODO: restore
                    //this.setMenuItems([]);
                    connection.invoke("newGame", action.name);
                    break;
                }
                case SET_LOBBY_GAME: {
                    history.push(`/game/${name}`);
                    break;
                }
                case CONNECTION_CONNECT: {
                    setTimeout(() => {
                        if (getState().connection.status == ConnectionStatus.NotConnected) {
                            
                            bumpConnectionTimeout();
                            connectionStarted = new Date();
                            dispatch(updateConnectionStatus(ConnectionStatus.Pending));
                            connection.start().then(() => {
                                connectionTimeout = 0;
                                ReactAI.ai().trackMetric("connected", getDuration(connectionStarted));
                                connection.invoke("connect", getState().user, action.lobbyId).catch(() => {
                                    dispatch(connectionConnect(action.lobbyId));
                                });
                            }).catch((err) => {
                                    dispatch(updateConnectionStatus(ConnectionStatus.NotConnected));
                                    dispatch(connectionConnect(action.lobbyId));
                                return console.error(err.toString());
                            });
                        }
                    }, connectionTimeout * 1000);
                    break;
                }
                case SET_CONNECTION_STATUS: {
                    switch (action) {
                        case ConnectionStatus.NotConnected: dispatch(connectionConnect()); break;
                        case ConnectionStatus.Connected: {
                            if (getState().lobby.currentGame)
                                history.push(`/game/${getState().lobby.currentGame}`);
                            else
                                history.push("/");
                            break;
                        }
                    }
                    break;
                }
                case JOIN_LOBBY: {
                    connection.invoke("connectToLobby", getState().user,  action.id);
                    break;
                }
                case CLOSE_LOBBY: {
                    connection.invoke("closelobby");
                    break;
                }
                case CREATE_LOBBY: {
                    connection.invoke("createLobby", guid(), action.name, action.isAdmin)
                        .catch((err) => console.log(err));
                    break;
                }
                case GAME_MESSAGE_ADMIN: {
                    const payload = JSON.stringify({ admin: action.message });
                    connection.invoke("hubMessage", payload);
                    break;
                }
                case GAME_MESSAGE_CLIENT: {
                    const payload = JSON.stringify({ client: action.message });
                    connection.invoke("hubMessage", payload);
                    break;
                }
            }
            return new(action);
        }
    }
}

const loggerMiddleware: Middleware = ({ getState }: MiddlewareAPI) => (
  next: Dispatch
) => action => {
  console.log('will dispatch', action)
  const returnValue = next(action)
  console.log('state after dispatch', getState())
  return returnValue
}