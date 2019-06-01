import React, { Component } from 'react';
import { FormGroup, ControlLabel, FormControl, HelpBlock, Button } from 'react-bootstrap';

interface Props {
    createLobby: (lobbyName: string) => void;
}

type State = {
    name: string
}

export class CreateLobby extends Component<Props, State> {
    displayName = CreateLobby.name

    constructor(props: Props) {
        super(props);
        this.state = { name: "My Lobby" };
    }

    getValidationState() {
        const length = this.state.name.length;
        if (length > 2) return 'success';
        else if (length > 0) return 'error';
        return null;
    }

    onSubmit = (e: React.SyntheticEvent<EventTarget>) => {
        this.props.createLobby(this.state.name);
        e.preventDefault();
    }

    handleChange = (e: React.FormEvent<FormControl>) => {
        const target = e.target as HTMLInputElement;
        this.setState({name: target.value});
    }

    render() {
        return (
            <div>
              <h2>Create lobby</h2>
                <form onSubmit={this.onSubmit}>
                    <FormGroup
                        controlId="formBasicText"
                        validationState={this.getValidationState()}
                    >
                        <ControlLabel>Give this lobby a name</ControlLabel>
                        <FormControl
                            type="text"
                            placeholder="Enter text"
                            name="name"
                            value={this.state.name}
                            onChange={this.handleChange}
                        />
                        <FormControl.Feedback />
                        <HelpBlock>You must enter a lobby name.</HelpBlock>
                    </FormGroup>
                    <Button bsStyle="primary" bsSize="large" onClick={this.onSubmit}>
                        Create
                    </Button>
                </form>
            </div>
        );
    }
}
