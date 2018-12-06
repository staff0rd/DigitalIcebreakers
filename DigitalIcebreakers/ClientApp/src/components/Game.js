import React, { Component } from 'react';
import Games from '../games/Games';

export class Game extends Component {
    displayName = Game.name

    getGame() {
        var game = Games(this.props).games.filter(g => g.name === this.props.match.params.name)[0];
        if (game)
            return game.component;
        var app = Games(this.props).apps.filter(g => g.name === this.props.match.params.name)[0];
        if (app)
            return app.component;
    }

    render() {
        return (
            <div>
                {this.getGame()}
            </div>
        );
    }
}
