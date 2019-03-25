import React from 'react';
import { DoggosVsKittehs } from './DoggosVsKittehs/DoggosVsKittehs';
import { YesNoMaybe } from './YesNoMaybe/YesNoMaybe';
import { Buzzer } from './Buzzer/Buzzer';
import PongPresenter from './Pong/PongPresenter';
import { PongClient } from './Pong/PongClient';

export default function (props) {
    return [{
        name: "doggos-vs-kittehs",
        client: <DoggosVsKittehs {...props} />,
        presenter: <DoggosVsKittehs {...props} />,
        title: "Doggos vs Kittehs",
        isGame: true
    }, {
        name: "yes-no-maybe",
        client: <YesNoMaybe {...props} />,
        presenter: <YesNoMaybe {...props} />,
        title: "Yes, No, Maybe"
    }, {
        name: "buzzer",
        client: <Buzzer {...props} />,
        presenter: <Buzzer {...props} />,
        title: "Buzzer",
        fullscreen: true
    }, {
        name: "pong",
        client: <PongClient {...props} />,
        presenter: <PongPresenter {...props} />,
        title: "Pong",
        fullscreen: true,
        isGame: true
    }];
}
