import { Component } from 'react';

export class Graph extends Component {
    displayName = Graph.name

    constructor(props, context, debug) {
        super(props, context);

        this.debug = false;
        if (this.debug)
            console.log('constructed');
    }
}