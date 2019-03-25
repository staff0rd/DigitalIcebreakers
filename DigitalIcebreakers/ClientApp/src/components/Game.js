import React, { Component } from 'react';
import Games from '../games/Games';

export class Game extends Component {
    displayName = Game.name

    getComponent() {
        const game = Games(this.props).filter(g => g.name === this.props.match.params.name)[0];

        if (!game)
            return "No such game";

        if (this.props.isAdmin)
            return game.presenter;
        else
            return game.client;
    }

    render() {
        
        return (
            <div className="full-height">
                {this.getComponent()}
            </div>
        );
    }
}
