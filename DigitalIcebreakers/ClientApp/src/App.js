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

export default class App extends Component {
    displayName = App.name

    constructor(props, context) {
        super(props, context);

        this.myStorage = window.localStorage;

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
            }
        };

        this.configureSignalR();
    }

    configureSignalR() {
        this.connection = new HubConnectionBuilder().withUrl("/gameHub").build();
        const component = this;

        this.connection.on("reconnect", (response) => {
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

                history.push("/");
        });

        this.connection.on("closelobby", () => {
            console.log("dat lobby is closed, son");
            this.setState({ lobby: {} });
            history.push('/lobbyClosed');
        });

        this.connection.on("connected", () => {
            console.log("Connected");
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
           history.push(`/game/${name}`);
        });

        this.connection.on("endGame", () => {
            console.log("game ended");
        });

        this.connection.start()
            .then(() => {
                this.connection.invoke("connect", this.user);
            })
            .catch((err) => {
                return console.error(err.toString());
            });
    }

    joinLobby = (id, name) => {
        this.user.name = name;
        this.connection.invoke("connectToLobby", this.user,  id);
    }

    closeLobby = () => {
        this.connection.invoke("closelobby");
    }

    createLobby = (name) => {
        this.connection.invoke("createLobby", guid(), name, this.state.user);
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
                <Layout currentGame={this.state.lobby.currentGame} lobbyId={this.state.lobby.id} isAdmin={this.state.lobby.isAdmin}>
                    <Route exact path='/' render={() => <Lobby id={this.state.lobby.id} players={this.state.lobby.players} name={this.state.lobby.name} /> } />
                    <Route path='/createLobby' render={() => <CreateLobby createLobby={this.createLobby} /> } />
                    <Route path='/closeLobby' render={() => <CloseLobby closeLobby={this.closeLobby} /> }  />
                    <Route path='/lobbyClosed' component={LobbyClosed} />
                    <Route path='/counter' component={Counter} />
                    <Route path='/fetchdata' component={FetchData} />
                    <Route path='/game/:name' component={Game} />
                    <Route path='/newGame' render={() => <NewGame newGame={this.newGame} />} />
                    <Route path='/join/:id' render={props => <Join join={this.joinLobby} {...props} /> }  />
                </Layout>
            </UserContext.Provider>
        );
    }
}
