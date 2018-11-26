import React, { Component } from 'react';
import { FormGroup, ControlLabel, FormControl, HelpBlock, Button } from 'react-bootstrap';
import {UserContext} from '../contexts/UserContext'

export class Join extends Component {
    displayName = Join.name

    constructor(props, context) {
        super(props, context);

        console.log('props', props);

        this.state = { name: this.context.name || "" };
       
        //const component = this;
        // this.connection = new HubConnectionBuilder().withUrl("/gameHub").build();
        // this.connection.start()
        //     .then(() => {
        //         this.connection.invoke("tryrejoin", this.props.match.params.id)
        //             .then((response) => {
        //                 console.log(response);
        //             });
        //     })
        //     .catch((err) => {
        //         return console.error(err.toString());
        //     });
        // this.connection.on("stop", () => {
        //     component.setState({ game: false });
        // });
    }

    getValidationState() {
        const length = this.state.name.length;
        if (length > 2) return 'success';
        else if (length > 0) return 'error';
        return null;
    }

    onSubmit = (e) => {
        if (this.getValidationState() == "success")
            this.props.join(this.props.match.params.id, this.state.name);       
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

Join.contextType = UserContext;