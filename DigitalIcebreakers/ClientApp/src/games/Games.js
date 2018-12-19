import React from 'react';
import { DoggosVsKittehs } from './DoggosVsKittehs/DoggosVsKittehs';
import { YesNoMaybe } from './YesNoMaybe/YesNoMaybe';
import { Buzzer } from './Buzzer/Buzzer';
import { Pong } from './Pong/Pong'

export default function (props) {
    return [{
        name: "doggos-vs-kittehs",
        component: <DoggosVsKittehs {...props} />,
        title: "Doggos vs Kittehs",
        isGame: true
    }, {
        name: "yes-no-maybe",
        component: <YesNoMaybe {...props} />,
        title: "Yes, No, Maybe"
    }, {
        name: "buzzer",
        component: <Buzzer {...props} />,
        title: "Buzzer",
        fullscreen: true
    }, {
        name: "pong",
        component: <Pong {...props} />,
        title: "Pong",
        fullscreen: true,
        isGame: true
    }];
}
