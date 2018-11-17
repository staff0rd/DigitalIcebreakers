import React, { Component } from 'react';
import { HubConnectionBuilder } from '@aspnet/signalr';
import { FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';

export class Game extends Component {
    displayName = Game.name

    constructor(props) {
        super(props);
        this.state = { name: '', game: true };
        this.join = this.join.bind(this);
        this.handleChange = this.handleChange.bind(this);
        const component = this;
        this.connection = new HubConnectionBuilder().withUrl("/gameHub").build();
        this.connection.start().catch((err) => {
            return console.error(err.toString());
        });
        this.connection.on("stop", () => {
            component.setState({ game: false });
            console.log("game was ended");
        });
    }

    getValidationState() {
        const length = this.state.name.length;
        if (length > 2) return 'success';
        else if (length > 0) return 'error';
        return null;
    }

    join(e) {
        console.log(this.state.name);
        this.connection.invoke("Join", this.props.match.params.id,this.state.name).catch(err => console.error(err.toString()));
        e.preventDefault();
    }

    handleChange(e) {
        const change = { [e.target.name]: e.target.value };
        this.setState(change);
    }

    render() {
        return (
            !this.state.game ? "This game has ended" :
            <div>
                <form onSubmit={this.join}>
                    <FormGroup
                        controlId="formBasicText"
                        validationState={this.getValidationState()}
                    >
                        <ControlLabel>How would you like to be known?</ControlLabel>
                        <FormControl
                            type="text"
                            placeholder="Enter text"
                            name = "name"
                            onChange={this.handleChange}
                        />
                        <FormControl.Feedback />
                        <HelpBlock>You must enter a name before you can join.</HelpBlock>
                    </FormGroup>
                </form>
            </div>
        );
    }
}
