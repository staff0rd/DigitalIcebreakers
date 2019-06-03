import React, { Component } from 'react';
import { HelpBlock, Button } from 'react-bootstrap';
import { ChangelogItem } from '../ChangelogItem';
import { RenderTarget } from 'pixi.js';


interface ChangelogState {
    changelogs: ChangelogItem[]
}

export class Changelog extends Component<{}, ChangelogState> {
    displayName = Changelog.name

    constructor(props: any) {
        super(props);

        this.state 
    }

    render() {
        const items: JSX.Element[] = [];
        return (
            <div>
                { items }
            </div>
        );
    }
}
