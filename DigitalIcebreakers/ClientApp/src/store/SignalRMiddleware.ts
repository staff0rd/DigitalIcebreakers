import { MiddlewareAPI, Dispatch } from '@reduxjs/toolkit'
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr'
import { CONNECTION_CONNECT, SET_CONNECTION_STATUS, SET_GAME_UPDATE_CALLBACK, CLEAR_GAME_UPDATE_CALLBACK, ConnectionActionTypes } from './connection/types'
import { updateConnectionStatus, connectionConnect } from './connection/actions'
import ReactAI from 'react-appinsights'
import { ConnectionStatus } from '../ConnectionStatus'
import { setLobby, clearLobby, playerJoinedLobby, playerLeftLobby, setLobbyGame } from './lobby/actions'
import { setUser } from './user/actions'
import history from '../history'
import { CLEAR_LOBBY, SET_LOBBY_GAME, START_NEW_GAME, JOIN_LOBBY, CLOSE_LOBBY, CREATE_LOBBY, GAME_MESSAGE_CLIENT, GAME_MESSAGE_ADMIN, LobbyActionTypes } from './lobby/types'
import { guid } from '../util/guid'
import { UserActionTypes } from './user/types'
import { goToDefaultUrl } from './shell/actions'
import { GO_TO_DEFAULT_URL, ShellActionTypes } from './shell/types'

export const SignalRMiddleware = () => {
    const connectionRetrySeconds = [0, 1, 4, 9, 16, 25, 36, 49];
    let connectionStarted: Date;
    let connectionTimeout = 0;
    const connection: HubConnection = new HubConnectionBuilder().withUrl("/gameHub").build();
    connection.keepAliveIntervalInMilliseconds = 2000;
    const bumpConnectionTimeout = () => {
        connectionTimeout = connectionRetrySeconds.filter(s => s > connectionTimeout)[0];
        if (!connectionTimeout)
            connectionTimeout = connectionRetrySeconds[connectionRetrySeconds.length - 1];
    };
    const getDuration = (from: Date, to: Date = new Date()) => {
        return to.valueOf() - from.valueOf();
    };
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
            if (response.currentGame) {
                history.push(`/game/${response.currentGame}`);
            }
            else {
                history.push("/");
            }
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
            dispatch(clearLobby());
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
        const invoke = (methodName: string, ...params: any[]) => {
            connection.invoke(methodName, ...params)
                .catch((err) => console.log(err));
        };
        return (next: Dispatch) => (action: LobbyActionTypes | ConnectionActionTypes | UserActionTypes | ShellActionTypes) => {
            switch (action.type) {
                case SET_GAME_UPDATE_CALLBACK: {
                    connection.on("gameUpdate", (args: any) => {
                        action.callback(args)
                    });
                    return;
                }
                case CLEAR_GAME_UPDATE_CALLBACK: {
                    connection.off("gameUpdate");
                    break;
                }
                case CLEAR_LOBBY: {
                    history.push('/lobbyClosed');
                    break;
                }
                case START_NEW_GAME: {
                    // TODO: restore
                    //this.setMenuItems([]);
                    invoke("newGame", action.name);
                    break;
                }
                case SET_LOBBY_GAME: {
                    history.push(`/game/${action.game}`);
                    break;
                }
                case CONNECTION_CONNECT: {
                    setTimeout(() => {
                        if (getState().connection.status === ConnectionStatus.NotConnected) {
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
                    switch (action.status) {
                        case ConnectionStatus.NotConnected:
                            dispatch(connectionConnect());
                            break;
                        case ConnectionStatus.Connected: {
                            dispatch(goToDefaultUrl());                            
                            break;
                        }
                    }
                    break;
                }
                case JOIN_LOBBY: {
                    invoke("connectToLobby", getState().user, action.id);
                    break;
                }
                case CLOSE_LOBBY: {
                    invoke("closelobby");
                    break;
                }
                case CREATE_LOBBY: {
                    invoke("createLobby", guid(), action.name, getState().user);
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
                    if (history.location) {
                        const isJoin = history.location.pathname.startsWith('/join/');
                        if (!isJoin || action.ignoreJoin) {
                            if (getState().lobby.currentGame) {
                                history.push(`/game/${getState().lobby.currentGame}`);
                            } else {
                                history.push("/");
                            }
                        }
                    }
                    return;
                }
            }
            return next(action);
        };
    };
}
