import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Lobby } from './components/Lobby';
import { LobbyClosed } from './components/LobbyClosed';
import { FetchData } from './components/FetchData';
import { CreateLobby } from './components/CreateLobby';
import { CloseLobby } from './components/CloseLobby';
import { Counter } from './components/Counter';
import { Game } from './components/Game';
import { HubConnectionBuilder } from '@aspnet/signalr';
import { guid } from './util/guid';
import { UserContext } from './contexts/UserContext';
import { LobbyContext } from './contexts/LobbyContext';
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
                setLobbyId: (id, name, isAdmin) => {
                    this.setState({
                        lobby: {
                            name: name,
                            id: id,
                            isAdmin: isAdmin,
                            connection: this.connection,
                            createLobby: this.state.lobby.createLobby
                        }
                    });
                },
                createLobby: (name) => {
                    this.connection.invoke("createLobby", guid(), name, this.user);
                    console.log('create lobby');
                }
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
                    connection: this.connection,
                    createLobby: this.state.lobby.createLobby,
                    players: response.players
                },
                user: user
            });
            if (this.myStorage)
                this.myStorage.setItem("user", JSON.stringify(this.state.user));
            history.push("/");
        });

        this.connection.on("closelobby", () => {
            console.log("dat lobby is closed, son");
            this.setState({
                lobby: {
                    connection: this.connection,
                    createLobby: this.state.lobby.createLobby
                }
            });
            history.push('/lobbyClosed');
        });

        this.connection.on("connected", () => {
            console.log("Connected");
        });

        this.connection.on("joined", (user, count) => {
            component.state.players.push(user);
            component.setState({ players: component.state.players });
            console.log('join', user, count);
        });
        this.connection.on("left", (user, count) => {
            var players = component.state.players.filter(p => p.id !== user.id);
            component.setState({ players: players });

            console.log('left', user, count);
        });

        this.connection.start()
            .then(() => {
                this.connection.invoke("connect", this.user)
                    .then(() => {

                    });
            })
            .catch((err) => {
                return console.error(err.toString());
            });
    }

    render() {
        return (
            <UserContext.Provider value={this.state.user}>
                <LobbyContext.Provider value={this.state.lobby}>
                    <Layout>
                        <Route exact path='/' component={Lobby} />
                        <Route path='/createLobby' component={CreateLobby} />
                        <Route path='/closeLobby' component={CloseLobby} />
                        <Route path='/lobbyClosed' component={LobbyClosed} />
                        <Route path='/counter' component={Counter} />
                        <Route path='/fetchdata' component={FetchData} />
                        <Route path='/game/:id' component={Game} />
                    </Layout>
                </LobbyContext.Provider>
            </UserContext.Provider>
        );
    }
}
