import React, { Component } from 'react';
import { Route, Redirect } from 'react-router';
import Layout from './components/Layout';
import { Lobby } from './components/Lobby';
import { LobbyClosed } from './components/LobbyClosed';
import { NewGame } from './components/NewGame';
import { Game } from './components/Game';
import { CreateLobby } from './components/CreateLobby';
import { CloseLobby } from './components/CloseLobby';
import { Join } from './components/Join';
import { HubConnectionBuilder } from '@aspnet/signalr';
import { guid } from './util/guid';
import { UserContext } from './contexts/UserContext';
import history from './history';
import ReactAI from 'react-appinsights';
import { Events } from './Events';
import * as Version from './version';

const connectionRetrySeconds = [0, 1, 4, 9, 16, 25, 36, 49];

export default class App extends Component {
    displayName = App.name

    constructor(props, context) {
        super(props, context);

        this.isDebug = true;

        this.myStorage = window.localStorage;

        this.connectionTimeout = 0;

        if (this.myStorage) {
            const raw = this.myStorage.getItem("user");
            if (raw) {
                this.user = JSON.parse(raw);
                console.log("User retrieved", this.user);
            }
        }

        if (!this.user) {
            this.user = { id: guid() };
            if (this.myStorage)
                this.myStorage.setItem("user", JSON.stringify(this.user));
        }

        this.state = {
            user: this.user,
            lobby: {
                name: undefined,
                id: undefined,
                players: [],
                isAdmin: false
            },
            connected: 0,
            menuItems: []
        };

        ReactAI.setAppContext({ userId: this.user.id });

        this.configureSignalR();

        window.onresize = () => Events.handle('onresize');
    }

    debug() {
        if (this.isDebug)
            console.log('[app]', ...arguments);
    }

    configureSignalR() {
        this.connection = new HubConnectionBuilder().withUrl("/gameHub").build();
        const component = this;

        this.connection.on("reconnect", (response) => {
            this.debug("reconnect", response);
            
            ReactAI.ai().trackMetric("userReconnected", new Date() - this.connectionStarted);
            this.setState({connected: 2});
            let user = this.user;
            if (response.playerId) {
                user = {
                    id: response.playerId,
                    name: response.playerName
                };
            }
            
            this.setState({
                lobby: {
                    id: response.lobbyId,
                    name: response.lobbyName,
                    isAdmin: response.isAdmin
                },
                players: response.players,
                currentGame: response.currentGame,
                user: user
            });

            if (this.myStorage)
                this.myStorage.setItem("user", JSON.stringify(this.state.user));

            if (response.currentGame)
                history.push(`/game/${response.currentGame}`);
            else
                history.push("/");
        });

        this.connection.onclose(() => {
            this.debug("connection closed");
            ReactAI.ai().trackEvent("Connection closed");
            this.setState({ connected: 0 });
            this.connect();
        });

        this.connection.on("closelobby", () => {
            this.debug("lobby closed");
            ReactAI.ai().trackEvent("Lobby closed");
            this.setState({ lobby: {} });
            history.push('/lobbyClosed');
        });

        this.connection.on("connected", () => {
            this.debug("connected");
            ReactAI.ai().trackMetric("userConnected", new Date() - this.connectionStarted);
            this.setState({connected: 2});
        });

        this.connection.on("joined", (user) => {
            component.setState(prevState => ({
                players: [...prevState.players, user]
            }));
            console.log('joined', user);
        });

        this.connection.on("left", (user) => {
            component.setState(prevState => ({
                players: prevState.players.filter(p => p.id !== user.id)
            }));

            this.debug("left", user);
        });

        this.connection.on("newGame", (name) => {
            this.debug("newGame", name);
            ReactAI.ai().trackEvent("Joining new game");
            this.connection.off("gameUpdate");
            this.setState({ currentGame: name }, () => {
                history.push(`/game/${name}`);
            });
            
        });

        this.connection.on("endGame", () => {
            this.debug("endGame");
            ReactAI.ai().trackEvent("Game ended");
        });

        this.connect();
    }

    bumpConnectionTimeout() {
        this.connectionTimeout = connectionRetrySeconds.filter(s => s > this.connectionTimeout)[0];
        if (!this.connectionTimeout)
            this.connectionTimeout = connectionRetrySeconds[connectionRetrySeconds.length-1];
    }

    connect() {
        var lobbyId = undefined;
        if (history.location.pathname.startsWith("/join/")) {
            lobbyId = history.location.pathname.substr(6);
        }

        setTimeout(() => {
            if (this.state.connected > 0)
                return;
            this.bumpConnectionTimeout();
            this.connectionStarted = new Date();
            this.setState({connected: 1});
            this.connection.start()
           .then(() => {
               this.connectionTimeout = 0;
               ReactAI.ai().trackMetric("connected", new Date() - this.connectionStarted);
               this.connection.invoke("connect", this.user, lobbyId).catch(() => {
                   this.connect();
               });
           })
           .catch((err) => {
               this.setState({connected: 0});
               this.connect();
               return console.error(err.toString());
           });
        }, this.connectionTimeout * 1000);
    }

    joinLobby = (id, name) => {
        this.user.name = name;
        this.connection.invoke("connectToLobby", this.user,  id);
    }

    closeLobby = () => {
        this.connection.invoke("closelobby");
    }

    createLobby = (name) => {
        this.connection.invoke("createLobby", guid(), name, this.state.user)
            .catch((err) => console.log(err));
    }

    newGame = (name) => {
        this.setMenuItems([]);
        this.connection.invoke("newGame", name);
    }

    endGame = () => {
        this.connection.invoke("endGame");
    }

    redirect(condition, component) {
        if (condition)
            return component;
        else
            return () => <Redirect to="/" />
    }

    setMenuItems = (items) => {
        this.setState({menuItems: items});
    }

    render() {
        var connected = this.state.connected === 2;
        var game = this.redirect(connected, (props) => <Game isAdmin={this.state.lobby.isAdmin} setMenuItems={this.setMenuItems} connection={this.connection} {...props} />);
        var newGame = this.redirect(connected, () => <NewGame newGame={this.newGame} />);
        var closeLobby = this.redirect(connected, () => <CloseLobby closeLobby={this.closeLobby} />);

        return (
            <UserContext.Provider value={this.state.user}>
                <Layout menuItems={this.state.menuItems} currentGame={this.state.currentGame} lobbyId={this.state.lobby.id} isAdmin={this.state.lobby.isAdmin} connected={this.state.connected} version={Version.version}>
                    <Route exact path='/' render={() => <Lobby id={this.state.lobby.id} players={this.state.players} name={this.state.lobby.name} /> } />
                    <Route path='/createLobby' render={() => <CreateLobby createLobby={this.createLobby} /> } />
                    <Route path='/closeLobby' render={closeLobby }  />
                    <Route path='/lobbyClosed' component={LobbyClosed} />
                    <Route path='/game/:name' render={game} />
                    <Route path='/newGame' render={newGame} />
                    <Route path='/join/:id' render={props => <Join join={this.joinLobby} {...props} /> }  />
                </Layout>
            </UserContext.Provider>
        );
    }
}
