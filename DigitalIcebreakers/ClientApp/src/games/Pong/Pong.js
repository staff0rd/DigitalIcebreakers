import React, { Component } from 'react';
import { PongClient } from './PongClient';
import PongPresenter from './PongPresenter';

export class Pong extends Component {
    displayName = Pong.name

    renderAdmin() {
        return (
            <PongPresenter {...this.props} />
        );
    }

    renderPlayer() {
        return (
            <PongClient {...this.props} />
        );
    }

    render() {
        return this.props.isAdmin ? this.renderAdmin() : this.renderPlayer();
    }
}
