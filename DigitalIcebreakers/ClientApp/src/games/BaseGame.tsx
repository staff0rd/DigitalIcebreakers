import { Component } from 'react';
import { HubConnection } from '@microsoft/signalr';
import { Player } from '../Player';

export interface BaseGameProps {
    connection: HubConnection;
    setMenuItems(items: JSX.Element[]): void;
    players: Player[];
}

export class BaseGame<T extends BaseGameProps, U> extends Component<T, U> {
    displayName = BaseGame.name
    debug: boolean;
    myStorage: Storage;

    constructor(props: T, debug: boolean = false) {
        super(props);

        this.debug = debug;
        if (this.debug)
            console.log('constructed');

        this.myStorage = window.localStorage;
    }

    saveToStorage(storageKey: string, object: object) {
        if (this.myStorage) {
            this.myStorage.setItem(storageKey, JSON.stringify(object));
        }
    }

    getFromStorage(storageKey: string) : any | undefined {
        if (this.myStorage) {
            const raw = this.myStorage.getItem(storageKey);
            if (raw) {
                return JSON.parse(raw);
            }
        }
    }

    clearStorage(storageKey: string) {
        if (this.myStorage) {
            this.myStorage.removeItem(storageKey);
        }
    }
}
