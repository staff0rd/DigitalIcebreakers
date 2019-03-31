import React from 'react';
import { Button, Form } from 'react-bootstrap';
import { BaseGame } from '../BaseGame';

export class IdeaWallClient extends BaseGame {
    displayName = IdeaWallClient.name

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
            <Form>
                <Form.Group>
                    <Form.Label>Your idea</Form.Label>
                    <Form.Control as="textarea" rows="3" />
                </Form.Group>
            </Form>
        );
    }
}
