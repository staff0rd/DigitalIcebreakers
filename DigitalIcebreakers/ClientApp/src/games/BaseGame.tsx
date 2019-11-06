import { Component } from 'react';
import { HubConnection } from '@aspnet/signalr';

export interface BaseGameProps {
    connection: HubConnection;
    setMenuItems(items: JSX.Element[]): void;
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

    clientMessage(message: any) {
        const payload = JSON.stringify({ client: message });
        this.props.connection.invoke("hubMessage", payload);
    };

    adminMessage(message: any) {
        const payload = JSON.stringify({ admin: message });
        this.props.connection.invoke("hubMessage", payload);
    };
    
    unexpected(arg: any) {
        console.error('Unexpected: ', arg);
    }

    componentDidMount() {
        this.props.connection.off("gameUpdate");
        if (this.debug)
            console.log('componentDidMount');
    }

    shouldComponentUpdate(nextProps: BaseGameProps, nextState: any) {
        if (this.debug)
            console.log('shouldComponentUpdate', nextProps, nextState);
        return true;
    }
    componentDidUpdate() {
        if (this.debug)
            console.log('componentDidUpdate');
    }
    componentWillUnmount() {
        this.props.connection.off("gameUpdate");
        if (this.debug)
            console.log('componentWillUnmount');
    }
}
