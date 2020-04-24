import React from 'react';
import { ChangelogItem } from '../ChangelogItem';
import Moment from 'react-moment';

export function Changelog() {
    const changelogs = [
        new ChangelogItem(2020, 4, 24, "added #poll"),
        new ChangelogItem(2020, 4, 20, "reskin"),
        new ChangelogItem(2020, 4, 15, "added #splat + dev tutorial"),
        new ChangelogItem(2019, 11, 17, "added #reaction"),
        new ChangelogItem(2019, 6, 3, "added auto-arrange to #ideawall"),
        new ChangelogItem(2019, 5, 29, "fixed chart overflow in #yesnomaybe, #doggosvskittehs"),
        new ChangelogItem(2019, 5, 7, "added #broadcast"),
        new ChangelogItem(2019, 5, 4, "added score to #pong"),
        new ChangelogItem(2019, 4, 2, "added #ideawall"),
    ]

    return (
    <div>
        <h2>Updates</h2>
        <ul style={{paddingLeft: 25}}>
            {changelogs.map((cl, ix) => (
                <li key={ix}>
                    <span>{cl.change}</span> • <Moment fromNow>
                        {cl.date.toString()}
                    </Moment>
                </li>
            ))}
        </ul>
    </div>
    )
}
