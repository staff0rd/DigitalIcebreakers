import React from 'react';
import { DoggosVsKittehsClient } from './DoggosVsKittehs/DoggosVsKittehsClient';
import { DoggosVsKittehsPresenter } from './DoggosVsKittehs/DoggosVsKittehsPresenter';
import { YesNoMaybePresenter } from './YesNoMaybe/YesNoMaybePresenter';
import { YesNoMaybeClient } from './YesNoMaybe/YesNoMaybeClient';
import { IdeaWallClient } from './IdeaWall/IdeaWallClient';
import { IdeaWallPresenter } from './IdeaWall/IdeaWallPresenter';
import { Buzzer } from './Buzzer/Buzzer';
import PongPresenter from './Pong/PongPresenter';
import { PongClient } from './Pong/PongClient';

export default function (props) {
    return [{
        name: "doggos-vs-kittehs",
        client: <DoggosVsKittehsClient {...props} />,
        presenter: <DoggosVsKittehsPresenter {...props} />,
        title: "Doggos vs Kittehs",
        isGame: true
    }, {
        name: "yes-no-maybe",
        client: <YesNoMaybeClient {...props} />,
        presenter: <YesNoMaybePresenter {...props} />,
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
    }, {
        name: "ideawall",
        client: <IdeaWallClient {...props} />,
        presenter: <IdeaWallPresenter {...props} />,
        title: "Idea Wall",
        fullscreen: true,
        isGame: false
    }];
}
