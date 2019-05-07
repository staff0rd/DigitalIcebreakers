import React from 'react';
import { FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import { BaseGame } from '../BaseGame';

export class BroadcastPresenter extends BaseGame {
    displayName = BroadcastPresenter.name

    constructor(props, context) {
        super(props,context);
        
        this.state = {
            count: 0,
            value: ""
        };
    }

    componentDidMount() {
        super.componentDidMount();
        this.props.connection.on("gameUpdate", (result) => {
            if (result === "d") {
                this.setState(prevState => {
                    return {count: prevState.count+1};
                });
            }
        });
    }

    updateValue = (e) => {
        this.setState({value: e.target.value}, () => {
        this.props.connection.invoke("gameMessage", this.state.value);
        });
    }

    render() {
        return (
            <div className="vcenter">
                <div>
                    <h1 style={{fontSize:"100px"}}>
                        Dings: {this.state.count}
                    </h1>
                    <FormGroup>
                        <ControlLabel>Broadcast this</ControlLabel><br />
                        <FormControl type="text" value={this.state.value} onChange={this.updateValue} />
                    </FormGroup>
                </div>
            </div>
        );
    }
}
