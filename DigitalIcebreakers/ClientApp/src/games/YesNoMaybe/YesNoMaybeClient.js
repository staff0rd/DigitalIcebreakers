import React from 'react';
import { Button  } from 'react-bootstrap';
import { BaseGame } from '../BaseGame';

export class YesNoMaybeClient extends BaseGame {
    displayName = YesNoMaybeClient.name

    constructor(props, context) {
        super(props, context);

        this.state = {
            choice: undefined
        };
    }

    choose = (choice) => {
        this.setState({ choice: choice });
        this.props.connection.invoke("gameMessage", choice);
    }

    render() {
        const style = { height: '100px', width: '300px' };
        return (
            <div>
                <br />
                <Button onClick={() => this.choose("0")} bsSize="large" style={style} active={this.state.choice === "0"}>
                    Yes
                </Button>
                <br />
                <br />
                <Button onClick={() => this.choose("1")} bsSize="large" style={style} active={this.state.choice === "1"}>
                    No
                </Button>
            </div>
        );
    }
}
