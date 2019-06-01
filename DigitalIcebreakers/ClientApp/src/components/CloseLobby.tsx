import React, { Component } from 'react';
import { HelpBlock, Button } from 'react-bootstrap';

interface Props {
    closeLobby: React.MouseEventHandler<Button>;
}

export class CloseLobby extends Component<Props> {
    displayName = CloseLobby.name

    render() {
        return (
            <div>
                <form>
                    <HelpBlock>Closing the lobby will disconnect all players</HelpBlock>
                    <Button bsStyle="primary" bsSize="large" onClick={this.props.closeLobby}>
                        Close Lobby
                    </Button>
                </form>
            </div>
        );
    }
}
