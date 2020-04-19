import React, { Component } from 'react';
import { Redirect } from 'react-router';
import Layout from './layout/layouts/Admin';
import { guid } from './util/guid';
import history from './history';
import { Events } from './Events';
import { ConnectionStatus } from './ConnectionStatus';
import { Provider } from 'react-redux'
import { configureAppStore } from './store/configureAppStore'
import { EnhancedStore, AnyAction } from '@reduxjs/toolkit';
import { RootState } from './store/RootState';
import { connectionConnect } from './store/connection/actions';
import { Config } from './config';
import Admin from './layout/layouts/Admin';
import ReactAI from './app-insights-deprecated';
import { setUser } from './store/user/actions';
import { useSelector } from './store/useSelector';

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
                try {
                const user = JSON.parse(raw);
                console.log("User retrieved", user);
                return user;
                } catch {
                    this.debug('Could not parse user');
                }
            }
        }

        const user = { id: guid() };
        if (this.myStorage)
            this.myStorage.setItem("user", JSON.stringify(user));

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

    setMenuItems = (items: JSX.Element[]) => {
        this.setState({menuItems: items});
    }

    render() {
        return (
            <Provider store={this.store}>
                <Main />
            </Provider>
        );
    }
}

const Main = () => {

    const connectionStatus = useSelector(state => state.connection.status);
    const lobby = useSelector(state => state.lobby);
    const redirect = (condition: boolean, component: any) => {
        if (condition)
            return component;
        else
            return () => <Redirect to="/" />
    }

    const connected = connectionStatus === ConnectionStatus.Connected;
    // const game = redirect(connected, () => <Game />);
    // const newGame = redirect(connected, () => <NewGame />);
    // const closeLobby = redirect(connected, () => <CloseLobby />);
    
    return (
        <Layout isAdmin={lobby.isAdmin} currentGame={lobby.currentGame} lobbyId={lobby.id} />
    ); 
}
