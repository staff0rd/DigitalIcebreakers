import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Lobby } from './components/Lobby';
import { LobbyClosed } from './components/LobbyClosed';
import { NewGame } from './components/NewGame';
import { Game } from './components/Game';
import { FetchData } from './components/FetchData';
import { CreateLobby } from './components/CreateLobby';
import { CloseLobby } from './components/CloseLobby';
import { Counter } from './components/Counter';
import { Join } from './components/Join';
import { HubConnectionBuilder } from '@aspnet/signalr';
import { guid } from './util/guid';
import { UserContext } from './contexts/UserContext';
import history from './history';
import ReactAI from 'react-appinsights';

const connectionRetrySeconds = [0, 1, 4, 9, 16, 25, 36, 49]

export default class App extends Component {
    displayName = App.name

    constructor(props, context) {
        super(props, context);

        this.myStorage = window.localStorage;

        this.connectionTimeout = 0;

        if (this.myStorage) {
            const raw = this.myStorage.getItem("user");
            if (raw) {
                this.user = JSON.parse(raw);
                console.log("found user", this.user);
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
                isAdmin: false,
            },
            connected: 0
        };

        ReactAI.setAppContext({ userId: this.user.id });

        this.configureSignalR();
    }

    configureSignalR() {
        this.connection = new HubConnectionBuilder().withUrl("/gameHub").build();
        const component = this;

        this.connection.on("reconnect", (response) => {
            ReactAI.ai().trackEvent("Reconnect");
            let user = this.user;
            if (response.playerId) {
                user = {
                    id: response.playerId,
                    name: response.playerName,
                };
            }

            this.setState({
                lobby: {
                    id: response.lobbyId,
                    name: response.lobbyName,
                    isAdmin: response.isAdmin,
                    players: response.players,
                    currentGame: response.currentGame
                },
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
            ReactAI.ai().trackEvent("Connection closed");
            this.setState({connected: 0});
            this.connect();
        })

        this.connection.on("closelobby", () => {
            ReactAI.ai().trackEvent("Lobby closed");
            this.setState({ lobby: {} });
            history.push('/lobbyClosed');
        });

        this.connection.on("connected", () => {
            ReactAI.ai().trackMetric("userConnected", new Date() - this.connectionStarted);
            this.setState({connected: 2});
        });

        this.connection.on("joined", (user) => {
            component.setState(prevState => ({
                lobby: {
                    id: prevState.lobby.id,
                    name: prevState.lobby.name,
                    isAdmin: prevState.lobby.isAdmin,
                    players: [...prevState.lobby.players, user],
                    currentGame: prevState.currentGame
                }
            }));
            console.log('join', user);
        });

        this.connection.on("left", (user) => {
            component.setState(prevState => ({
                lobby: {
                    id: prevState.lobby.id,
                    name: prevState.lobby.name,
                    isAdmin: prevState.lobby.isAdmin,
                    players: prevState.lobby.players.filter(p => p.id !== user.id),
                    currentGame: prevState.currentGame
                }
            }));

            console.log('left', user);
        });

        this.connection.on("newGame", (name) => {
            ReactAI.ai().trackEvent("Joining new game");
            history.push(`/game/${name}`);
        });

        this.connection.on("endGame", () => {
            ReactAI.ai().trackEvent("Game ended");
        });

        this.connect();
    }

    connect() {
        setTimeout(() => {
            this.connectionTimeout = connectionRetrySeconds.filter(s => s > this.connectionTimeout)[0];
            if (!this.connectionTimeout)
                this.connectionTimeout = connectionRetrySeconds[connectionRetrySeconds.length-1];
            this.connectionStarted = new Date();
            this.setState({connected: 1});
            this.connection.start()
           .then(() => {
               this.connectionTimeout = 0;
               ReactAI.ai().trackMetric("connected", new Date() - this.connectionStarted);
               this.connection.invoke("connect", this.user).catch(() => {
                   this.connect();
               });
           })
           .catch((err) => {
               this.connect();
               return console.error(err.toString());
           });
        }, this.connectionTimeout);
    }

    joinLobby = (id, name) => {
        this.user.name = name;
        debugger;
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
        this.connection.invoke("newGame", name);
    }

    endGame = () => {
        this.connection.invoke("endGame");
    }

    render() {
        return (
            <UserContext.Provider value={this.state.user}>
                <Layout currentGame={this.state.lobby.currentGame} lobbyId={this.state.lobby.id} isAdmin={this.state.lobby.isAdmin} connected={this.state.connected}>
                    <Route exact path='/' render={() => <Lobby id={this.state.lobby.id} players={this.state.lobby.players} name={this.state.lobby.name} /> } />
                    <Route path='/createLobby' render={() => <CreateLobby createLobby={this.createLobby} /> } />
                    <Route path='/closeLobby' render={() => <CloseLobby closeLobby={this.closeLobby} /> }  />
                    <Route path='/lobbyClosed' component={LobbyClosed} />
                    <Route path='/counter' component={Counter} />
                    <Route path='/fetchdata' component={FetchData} />
                    <Route path='/game/:name' render={props => <Game isAdmin={this.state.lobby.isAdmin} connection={this.connection} {...props} /> } />
                    <Route path='/newGame' render={() => <NewGame newGame={this.newGame} />} />
                    <Route path='/join/:id' render={props => <Join join={this.joinLobby} {...props} /> }  />
                </Layout>
            </UserContext.Provider>
        );
    }
}
