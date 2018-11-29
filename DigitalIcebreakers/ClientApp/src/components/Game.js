import React, { Component } from 'react';
import { DoggosVsKittehs } from '../games/DoggosVsKittehs/DoggosVsKittehs';
import { YesNoMaybe } from '../games/YesNoMaybe/YesNoMaybe';

export class Game extends Component {
    displayName = Game.name

    getGame() {
        switch (this.props.match.params.name) {
            case "doggos-vs-kittehs": return <DoggosVsKittehs {...this.props} />;
            case "yes-no-maybe": return <YesNoMaybe {...this.props} />;
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
