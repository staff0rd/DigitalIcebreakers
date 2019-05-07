import React from 'react';
import { Button  } from 'react-bootstrap';
import { BaseGame } from '../BaseGame';

export class BroadcastClient extends BaseGame {
    displayName = BroadcastClient.name

    constructor(props, context) {
        super(props, context);

        this.state = {
            value: undefined
        };
    }

    componentDidMount() {
        super.componentDidMount();
        this.props.connection.on("gameUpdate", (result) => {
            this.setState({
                value: result
            }, this.init);
        });
    }

    render() {
        const style = { height: '100px', width: '300px' };
        return (
            <div>
                {this.state.value}
            </div>
        );
    }
}
