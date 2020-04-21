import { Component } from 'react';
import { Player } from '../Player';

export interface BaseGameProps {
    setMenuItems(items: JSX.Element[]): void;
    players: Player[];
}

export class BaseGame<T extends BaseGameProps, U> extends Component<T, U> {
    displayName = BaseGame.name
    debug: boolean;
    

    constructor(props: T, debug: boolean = false) {
        super(props);

        this.debug = debug;
        if (this.debug)
            console.log('constructed');
    }
}
