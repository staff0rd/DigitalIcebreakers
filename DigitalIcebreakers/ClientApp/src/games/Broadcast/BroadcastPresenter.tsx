import React from 'react';
import { FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import { BaseGame, BaseGameProps } from '../BaseGame';

interface BroadcastPresenterState {
    count: number;
    value: string;
}

export class BroadcastPresenter extends BaseGame<BaseGameProps, BroadcastPresenterState> {
    displayName = BroadcastPresenter.name

    constructor(props: BaseGameProps) {
        super(props);
        
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

    updateValue = (e: React.FormEvent<FormControl>) => {
        const target = e.target as HTMLInputElement;
        this.setState({value: target.value}, () => {
            this.adminMessage(this.state.value);
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
