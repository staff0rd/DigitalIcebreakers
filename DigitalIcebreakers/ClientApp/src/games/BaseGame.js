import { Component } from 'react';

export class BaseGame extends Component {
    displayName = BaseGame.name

    constructor(props, context, debug) {
        super(props, context);

        this.debug = true;
        if (this.debug)
            console.log('constructed');
    }
    
    unexpected() {
        console.error('Unexpected: ', ...arguments);
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
    shouldComponentUpdate(nextProps, nextState) {
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
