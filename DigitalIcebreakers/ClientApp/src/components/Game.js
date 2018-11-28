import React, { Component } from 'react';
import {DoggosVsKittehs} from '../games/DoggosVsKittehs/DoggosVsKittehs';

export class Game extends Component {
    displayName = Game.name

    getGame() {
        switch (this.props.match.params.name) {
            case "doggos-vs-kittehs": return <DoggosVsKittehs {...this.props} />;
            default: return;
        }
    }

    render() {
        return (
            <div>
                {this.getGame()}
            </div>
        );
    }
}
