import React from 'react';
import { FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import { BaseGame } from '../BaseGame';

export class BroadcastPresenter extends BaseGame {
    displayName = BroadcastPresenter.name

    constructor(props, context) {
        super(props,context);
        
        this.state = {
            count: 0,
            value: undefined
        };
    }

    componentDidMount() {
        super.componentDidMount();
        this.props.connection.on("gameUpdate", (result) => {
            this.setState(prevState => {
                count: prevState.count+1
            });
        });
    }

    updateValue = (value) => {
        debugger;
        this.setState({value: value}, () => {
            debugger;
            this.props.connection.invoke("gameMessage", value);
        });
    }

    render() {
        return (
            <FormGroup>
                <ControlLabel>Broadcast this</ControlLabel><br />
                <FormControl type="text" value={this.state.value} onChange={this.updateValue} />
            </FormGroup>
        );
    }
}
