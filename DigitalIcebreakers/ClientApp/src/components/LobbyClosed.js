import React, { Component } from 'react';
import { Alert } from 'react-bootstrap';

export class LobbyClosed extends Component {
    displayName = LobbyClosed.name

    render() {
        return (
            <Alert bsStyle="warning">
                <strong>This lobby has been closed.</strong> Thanks for playing!
            </Alert>
        );
    }
}
