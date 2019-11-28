import React from 'react';
import { HelpBlock, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { closeLobby } from '../store/lobby/actions';

export const CloseLobby = () => {
    const dispatch = useDispatch();
    return (
        <div>
            <form>
                <HelpBlock>Closing the lobby will disconnect all players</HelpBlock>
                <Button bsStyle="primary" bsSize="large" onClick={() => dispatch(closeLobby())}>
                    Close Lobby
                </Button>
            </form>
        </div>
    );
}
