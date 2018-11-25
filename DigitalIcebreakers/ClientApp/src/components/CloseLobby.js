import React, { Component } from 'react';
import { HelpBlock, Button } from 'react-bootstrap';
import { LobbyContext } from '../contexts/LobbyContext';

export class CloseLobby extends Component {
    displayName = CloseLobby.name

    onSubmit = (e) => {
        console.log('closing lobby');
        this.context.connection.invoke("closelobby").then(() => {
            console.log("closing dat lobby");
        });
        e.preventDefault();
    }

    render() {
        return (
            <div>
                <form onSubmit={this.onSubmit}>
                    <HelpBlock>Closing the lobby will disconnect all players</HelpBlock>
                    <Button bsStyle="primary" bsSize="large" onClick={this.onSubmit}>
                        Close Lobby
                    </Button>
                </form>
            </div>
        );
    }
}

CloseLobby.contextType = LobbyContext;
