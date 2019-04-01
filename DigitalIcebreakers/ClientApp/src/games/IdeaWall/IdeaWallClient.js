import React from 'react';
import { Button, Form, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import { BaseGame } from '../BaseGame';
import { Colors } from '../../Colors';

const MAX_CHARACTERS = 50;

export class IdeaWallClient extends BaseGame {
    displayName = IdeaWallClient.name

    constructor(props, context) {
        super(props, context);

        this.state = {
            idea: ""
        };
    }

    choose = (choice) => {
        this.setState({ choice: choice });
        this.props.connection.invoke("gameMessage", choice);
    }

    handleChange = (e) => {
        this.setState({ idea: e.target.value });
    }

    render() {
        const characters = this.state.idea.length;
        const style = characters >= MAX_CHARACTERS - 5 ? { color: "#D32F2F" } : {};
        return (
            <Form>
                <FormGroup>
                    <ControlLabel>Your idea <span style={style}>({characters}/{MAX_CHARACTERS})</span></ControlLabel>
                    <FormControl maxLength={MAX_CHARACTERS} componentClass="textarea" rows={3} onChange={this.handleChange} value={this.state.idea} />
                </FormGroup>
                <Button type="submit" bsStyle="primary" bsSize="large" style={{margin: "6px"}}>
                    Submit
                </Button>
            </Form>
        );
    }
}
