import { Component } from 'react';
import { HubConnection } from '@aspnet/signalr';

export interface BaseGameProps {
    connection: HubConnection;
}

export class BaseGame<T extends BaseGameProps, U> extends Component<T, U> {
    displayName = BaseGame.name
    debug: boolean;

    constructor(props: T, context: U, debug: boolean = false) {
        super(props, context);

        this.debug = debug;
        if (this.debug)
            console.log('constructed');
    }
    
    unexpected(arg: any) {
        console.error('Unexpected: ', arg);
    }

    componentWillMount() {
        this.props.connection.off("gameUpdate");
        if (this.debug)
            console.log('componentWillMount');
    }
    componentDidMount() {
        this.props.connection.off("gameUpdate");
        if (this.debug)
            console.log('componentDidMount');
    }
    componentWillReceiveProps() {
        if (this.debug)
            console.log('componentWillReceiveProps');
    }
    shouldComponentUpdate(nextProps: BaseGameProps, nextState: any) {
        if (this.debug)
            console.log('shouldComponentUpdate', nextProps, nextState);
        return true;
    }
    componentWillUpdate() {
        if (this.debug)
            console.log('componentWillUpdate');
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
