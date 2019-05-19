import React, { Component } from 'react';
import { FormGroup, ControlLabel, FormControl, HelpBlock, Button } from 'react-bootstrap';

export class CreateLobby extends Component {
    displayName = CreateLobby.name

    constructor(props) {
        super(props);
        this.state = { name: "My Lobby" };
    }

    componentDidUpdate() {
        if (this.context.id) {
            this.props.history.push('/');
        }
    }

    getValidationState() {
        const length = this.state.name.length;
        if (length > 2) return 'success';
        else if (length > 0) return 'error';
        return null;
    }

    onSubmit = (e) => {
        this.props.createLobby(this.state.name);
        e.preventDefault();
    }

    handleChange = (e) => {
        const change = { [e.target.name]: e.target.value };
        if (e.target.name === "name" && this.myStorage)
            this.myStorage.setItem("name", e.target.value);
        this.setState(change);
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
