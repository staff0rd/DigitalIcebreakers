import React, { Component } from 'react';
import { HubConnectionBuilder } from '@aspnet/signalr';
import { FormGroup, ControlLabel, FormControl, HelpBlock, Button } from 'react-bootstrap';

export class Game extends Component {
    displayName = Game.name

    constructor(props) {
        super(props);
        this.myStorage = window.localStorage;
        this.state = { game: true };
        if (this.myStorage)
            this.state.name = this.myStorage.getItem('name') || '';
        this.onSubmit = this.onSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        const component = this;
        this.connection = new HubConnectionBuilder().withUrl("/gameHub").build();
        this.connection.start()
            .then(() => {
                this.connection.invoke("tryrejoin", this.props.match.params.id)
                    .then((response) => {
                        console.log(response);
                    });
            })
            .catch((err) => {
                return console.error(err.toString());
            });
        this.connection.on("stop", () => {
            component.setState({ game: false });
        });

        //fetch(`api/Game/${this.props.match.params.id}`)
        //    .then(response => response.json())
        //    .then(data => {
        //        debugger;
        //        this.setState({ forecasts: data, loading: false });
        //    });
    }

    getValidationState() {
        const length = this.state.name.length;
        if (length > 2) return 'success';
        else if (length > 0) return 'error';
        return null;
    }

    join() {
        this.connection.invoke("Join", this.props.match.params.id, this.state.name).catch(err => console.error(err.toString()));
    }

    onSubmit(e) {
        this.join();       
        e.preventDefault();
    }

    handleChange(e) {
        const change = { [e.target.name]: e.target.value };
        if (e.target.name === "name" && this.myStorage)
            this.myStorage.setItem("name", e.target.value);
        this.setState(change);
    }

    render() {
        return (
            !this.state.game ? "This game has ended" :
            <div>
                <form onSubmit={this.onSubmit}>
                    <FormGroup
                        controlId="formBasicText"
                        validationState={this.getValidationState()}
                    >
                        <ControlLabel>How would you like to be known?</ControlLabel>
                        <FormControl
                            type="text"
                            placeholder="Enter text"
                            name="name"
                            value={this.state.name}
                            onChange={this.handleChange}
                        />
                        <FormControl.Feedback />
                        <HelpBlock>You must enter a name before you can join.</HelpBlock>
                        </FormGroup>
                        <Button bsStyle="primary" bsSize="large" onClick={this.onSubmit}>
                            Join
                        </Button>
                </form>
            </div>
        );
    }
}
