import React, { Component } from 'react';
import { Route, Redirect } from 'react-router';
import Layout from './components/Layout';
import { LobbySwitch } from './components/Lobby';
import { LobbyClosed } from './components/LobbyClosed';
import { NewGame } from './components/NewGame';
import { Game } from './components/Game';
import { CreateLobby } from './components/CreateLobby';
import { CloseLobby } from './components/CloseLobby';
import { Join } from './components/Join';
import { guid } from './util/guid';
import history from './history';
import { Events } from './Events';
import * as Version from './version.json';
import { ConnectionStatus } from './ConnectionStatus';
import { Provider } from 'react-redux'
import { configureAppStore } from './store/configureAppStore'
import { EnhancedStore, AnyAction } from '@reduxjs/toolkit';
import { RootState } from './store/RootState';
import { connectionConnect } from './store/connection/actions';
import ReactAI from 'react-appinsights';
import { setUser } from './store/user/actions';

type AppState = {
    user: User;
    lobby?: AppLobby,
    players: User[],
    menuItems: JSX.Element[],
    currentGame?: string,
    isAdmin: boolean
}

type User = {
    id: string;
    name: string;
}

type AppLobby = {
    name: string,
    id: string
}

export default class App extends Component<{}, AppState> {
    displayName = App.name
    private isDebug = false;
    private myStorage: Storage;
    
    private user: User;
    private store: EnhancedStore<RootState, AnyAction>;

    constructor(props: any, context: any) {
        super(props, context);

        this.isDebug = true;

        this.myStorage = window.localStorage;

        this.user = this.getUser();
        this.state = {
            user: this.user,
            isAdmin: false,
            menuItems: [],
            players: []
        };

        this.store = configureAppStore();
        
        this.store.dispatch(setUser(this.user));

        ReactAI.setAppContext({ userId: this.user.id });

        window.onresize = () => Events.emit('onresize');

        this.store.dispatch(connectionConnect());
    }

    private getUser() {
        if (this.myStorage) {
            const raw = this.myStorage.getItem("user");
            if (raw) {
                const user = JSON.parse(raw);
                console.log("User retrieved", user);
                return user;
            }
        }

        const user = { id: guid() };
        if (this.myStorage)
            this.myStorage.setItem("user", JSON.stringify(this.user));

        return user;
    }

    debug(...a: any[]) {
        if (this.isDebug)
            console.log('[app]', ...a);
    }

    getCurrentLocation() {
        return history.location || window.location;
    }

    connect() {
        let lobbyId:string|undefined = undefined;
        if (this.currentLocationIsJoin()) {
            lobbyId = this.getCurrentLocation().pathname.substr(6);
        }
        this.store.dispatch(connectionConnect(lobbyId));
    }

    currentLocationIsJoin() {
        return this.getCurrentLocation().pathname.startsWith("/join/");
    }

    redirect(condition: boolean, component: any) {
        if (condition)
            return component;
        else
            return () => <Redirect to="/" />
    }

    setMenuItems = (items: JSX.Element[]) => {
        this.setState({menuItems: items});
    }

    render() {
        const connected = this.store.getState().connection.status === ConnectionStatus.Connected;
        const game = this.redirect(connected, (props:any) => <Game isAdmin={this.state.isAdmin} setMenuItems={this.setMenuItems} {...props} players={this.state.players} />);
        const newGame = this.redirect(connected, () => <NewGame />);
        const closeLobby = this.redirect(connected, () => <CloseLobby />);

        return (
            <Provider store={this.store}>
                <Layout menuItems={this.state.menuItems} currentGame={this.state.currentGame} isAdmin={this.state.isAdmin} version={Version.version} lobbyId={this.state.lobby && this.state.lobby.id}>
                    <Route exact path='/' render={() => <LobbySwitch lobby={this.state.lobby} players={this.state.players} /> } />
                    <Route path='/createLobby' render={() => <CreateLobby /> } />
                    <Route path='/closeLobby' render={closeLobby }  />
                    <Route path='/lobbyClosed' component={LobbyClosed} />
                    <Route path='/game/:name' render={game} />
                    <Route path='/newGame' render={newGame} />
                    <Route path='/join/:id' render={props => <Join {...props} /> }  />
                </Layout>
            </Provider>
        );
    }
}
