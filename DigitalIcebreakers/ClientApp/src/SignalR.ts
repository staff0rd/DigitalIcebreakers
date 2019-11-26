import { HubConnectionBuilder, HubConnection } from "@aspnet/signalr";
import { SignalRMessaging } from "./SignalRMessaging";
import App from "./App";
import ReactAI from 'react-appinsights';
import { setConnectionStatus } from "./store/connection/actions";
import { ConnectionStatus } from "./ConnectionStatus";
import { AnyAction } from "redux";
import { RootState } from "./store/RootState";
import { EnhancedStore } from "@reduxjs/toolkit";
import history from './history';
import { guid } from "./util/guid";



export class SignalR {
    private connection!: HubConnection;
    private store: EnhancedStore<RootState, AnyAction>;
    private debug: (...a: any[]) => void;
    
    constructor(store: EnhancedStore<RootState, AnyAction>, debug: (...a: any[]) => void) {
        this.store = store;
        this.debug = debug;
    }

    private get Messaging(): SignalRMessaging {
        return {
            clientMessage: (message: any) => {
                const payload = JSON.stringify({ client: message });
                this.connection.invoke("hubMessage", payload);
            },
            adminMessage: (message: any) => {
                const payload = JSON.stringify({ admin: message });
                this.connection.invoke("hubMessage", payload);
            }
        }
    }

    

    configure(parent: App, callback: () => void) {

        

        this.connect();
    }

    

    private get user() {
        return this.store.getState().user;
    }

    joinLobby = (id: string, name: string) => {
        this.user.name = name;
        this.connection.invoke("connectToLobby", this.user,  id);
    }

    closeLobby = () => {
        this.connection.invoke("closelobby");
    }

    createLobby = (name: string) => {
        this.connection.invoke("createLobby", guid(), name, this.user)
            .catch((err) => console.log(err));
    }
}