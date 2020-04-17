import React from 'react';
import DoggosVsKittehsClient from './DoggosVsKittehs/DoggosVsKittehsClient';
import DoggosVsKittehsPresenter from './DoggosVsKittehs/DoggosVsKittehsPresenter';
import { BroadcastClient } from './Broadcast/BroadcastClient';
import { BroadcastPresenter } from './Broadcast/BroadcastPresenter';
import YesNoMaybePresenter from './YesNoMaybe/YesNoMaybePresenter';
import YesNoMaybeClient from './YesNoMaybe/YesNoMaybeClient';
import { IdeaWallClient } from './IdeaWall/IdeaWallClient';
import IdeaWallPresenter, { StartStopContinueLanes } from './IdeaWall/IdeaWallPresenter';
import BuzzerClient from './Buzzer/BuzzerClient';
import BuzzerPresenter from './Buzzer/BuzzerPresenter';
import SplatClient from './Splat/SplatClient';
import SplatPresenter from './Splat/SplatPresenter';
import PongPresenter from './Pong/PongPresenter';
import { PongClient } from './Pong/PongClient';
import { StartStopContinueClient } from './StartStopContinue/StartStopContinueClient';
// import { SlideshowClient } from './Slideshow/SlideshowClient';
// import { SlideshowPresenter } from './Slideshow/SlideshowPresenter';
import ReactClient from './React/ReactClient';
import ReactPresenter from './React/ReactPresenter';

export default [{
        name: "doggos-vs-kittehs",
        client: DoggosVsKittehsClient,
        presenter: DoggosVsKittehsPresenter,
        title: "Doggos vs Kittehs",
        isGame: true
    }, {
        name: "yes-no-maybe",
        client: YesNoMaybeClient,
        presenter: YesNoMaybePresenter,
        title: "Yes, No, Maybe"
    }, {
        name: "buzzer",
        client: BuzzerClient,
        presenter: BuzzerPresenter,
        title: "Buzzer",
        fullscreen: true
    }, {
        name: "splat",
        client: SplatClient,
        presenter: SplatPresenter,
        title: "Splat",
        fullscreen: true
    }, {
        name: "pong",
        client: PongClient,
        presenter: PongPresenter,
        title: "Pong",
        fullscreen: true,
        isGame: true
    // }, {
    //     name: "ideawall",
    //     client: IdeaWallClient,
    //     presenter: IdeaWallPresenter dynamicSize={false} {...props} storageKey="ideawall:ideas" />,
    //     title: "Idea Wall",
    //     fullscreen: true,
    //     isGame: false
    // }, {
    //     name: "startstopcontinue",
    //     client: <StartStopContinueClient,
    //     presenter: <IdeaWallPresenter dynamicSize={true} {...props} storageKey="startstopcontinue:ideas" lanes={StartStopContinueLanes} />,
    //     title: "Start Stop Continue",
    //     fullscreen: true,
    //     isGame: false,
    //     disabled: true
    }, {
        name: "broadcast",
        client: BroadcastClient,
        presenter: BroadcastPresenter,
        title: "Broadcast",
        fullscreen: true,
        isGame: false
    // }, {
    //     name: "slideshow",
    //     client: <SlideshowClient,
    //     presenter: <SlideshowPresenter {...props} storageKey="slideshow:state" />,
    //     title: "Slideshow",
    //     fullscreen: true,
    //     isGame: false
    }, {
        title: "Reaction",
        name: "react",
        client: ReactClient,
        presenter: ReactPresenter,
        fullscreen: true,
        isGame: true
    }];

