import React, { Component } from 'react';
import Games from '../games/Games';
import {RouteComponentProps } from 'react-router'
import { Player } from '../Player';

type Props = {
    isAdmin: boolean
    players: Player[]
}

type RouteParams = {
    name: string
}

export class Game extends Component<RouteComponentProps<RouteParams> & Props> {
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
