import React, { Component } from 'react';
import { HelpBlock, Button } from 'react-bootstrap';
import { ChangelogItem } from '../ChangelogItem';
import { RenderTarget } from 'pixi.js';
import Moment from 'react-moment';


interface ChangelogState {
    changelogs: ChangelogItem[]
}

export class Changelog extends Component<{}, ChangelogState> {
    displayName = Changelog.name

    constructor(props: any) {
        super(props);

        this.state = {
            changelogs: [
                new ChangelogItem(2019, 6, 3, "added auto-arrange to #ideawall"),
                new ChangelogItem(2019, 5, 29, "fixed chart overflow in #yesnomaybe, #doggosvskittehs"),
                new ChangelogItem(2019, 5, 7, "added #broadcast"),
                new ChangelogItem(2019, 5, 4, "added score to #pong"),
                new ChangelogItem(2019, 4, 2, "added #ideawall"),
            ]
        };
    }

    render() {
        const items: JSX.Element[] = [];
        for (let change of this.state.changelogs) {
            console.log(change);
            items.push(<li>
                <span>{change.change}</span> • <Moment fromNow>
                    {change.date.toString()}
                </Moment>
            </li>);
        }
        return (
            <div>
                <h2>updates</h2>
                { items }
            </div>
        );
    }
}
