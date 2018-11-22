import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { FetchData } from './components/FetchData';
import { Counter } from './components/Counter';
import { Game } from './components/Game';
import { HubConnectionBuilder } from '@aspnet/signalr';
import { guid } from './util/guid';
import { UserContext } from './contexts/UserContext'

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

        this.user.setLobbyId = (id, isAdmin) => {
            let user = {};
            Object.assign(user, this.user);
            user.lobbyId = id;
            user.isAdmin = isAdmin;
            this.setState({ user: user });
        };

        this.state = { user: this.user };

        this.configureSignalR();
    }

    configureSignalR() {
        this.connection = new HubConnectionBuilder().withUrl("/gameHub").build();
        const component = this;

        this.connection.on("Reconnect", (response) => {
            console.log("Reconnect", response);
        });

        this.connection.on("Connected", () => {
            console.log("Connected");
        });

        this.connection.on("Joined", (user, count) => {
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
              <Layout>
                <Route exact path='/' component={Home} />
                <Route path='/counter' component={Counter} />
                <Route path='/fetchdata' component={FetchData} />
                <Route path='/game/:id' component={Game} />
              </Layout>
          </UserContext.Provider>
    );
  }
}
