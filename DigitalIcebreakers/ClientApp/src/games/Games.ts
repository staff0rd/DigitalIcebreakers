import React from 'react';
import DoggosVsKittehsClient from './DoggosVsKittehs/DoggosVsKittehsClient';
import DoggosVsKittehsPresenter from './DoggosVsKittehs/DoggosVsKittehsPresenter';
import { BroadcastClient } from './Broadcast/BroadcastClient';
import { BroadcastPresenter } from './Broadcast/BroadcastPresenter';
import YesNoMaybePresenter from './YesNoMaybe/YesNoMaybePresenter';
import { YesNoMaybeMenu } from "./YesNoMaybe/YesNoMaybeMenu";
import YesNoMaybeClient from './YesNoMaybe/YesNoMaybeClient';
import { Name as YesNoMaybeName, yesNoMaybeReducer } from './YesNoMaybe/YesNoMaybeReducer';
import { IdeaWallClient } from './IdeaWall/IdeaWallClient';
import IdeaWallPresenter, { StartStopContinueLanes } from './IdeaWall/IdeaWallPresenter';
import BuzzerClient from './Buzzer/BuzzerClient';
import BuzzerPresenter from './Buzzer/BuzzerPresenter';
import SplatClient from './Splat/SplatClient';
import SplatPresenter from './Splat/SplatPresenter';
import PongPresenter from './Pong/PongPresenter';
import { PongClient } from './Pong/PongClient';
import PongMenu from './Pong/PongMenu';
import { StartStopContinueClient } from './StartStopContinue/StartStopContinueClient';
// import { SlideshowClient } from './Slideshow/SlideshowClient';
// import { SlideshowPresenter } from './Slideshow/SlideshowPresenter';
import ReactionClient from './Reaction/ReactionClient';
import ReactionPresenter from './Reaction/ReactionPresenter';

export default [{
        name: "doggos-vs-kittehs",
        client: DoggosVsKittehsClient,
        presenter: DoggosVsKittehsPresenter,
        title: "Doggos vs Kittehs",
        description: "Audience polling - Furry friend edition",
        isGame: true
    }, {
        name: YesNoMaybeName,
        client: YesNoMaybeClient,
        presenter: YesNoMaybePresenter,
        menu: YesNoMaybeMenu,
        title: "Yes, No, Maybe",
        description: "Audience polling - ask your audience questions and get real-time feedback",
    }, {
        name: "buzzer",
        client: BuzzerClient,
        presenter: BuzzerPresenter,
        title: "Buzzer",
        fullscreen: true,
        description: "Let your audience get a feel for low latency"
    }, {
        name: "splat",
        client: SplatClient,
        presenter: SplatPresenter,
        title: "Splat",
        fullscreen: true,
        description: "It's paint-ball for audiences and presenters"
    }, {
        name: "pong",
        client: PongClient,
        presenter: PongPresenter,
        menu: PongMenu,
        title: "Pong",
        fullscreen: true,
        isGame: true,
        description: 'Mob pong for large audiences - red vs blue!'
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
        isGame: false,
        description: 'Demonstration of two-way, real-time presenter and audience participation',
    // }, {
    //     name: "slideshow",
    //     client: <SlideshowClient,
    //     presenter: <SlideshowPresenter {...props} storageKey="slideshow:state" />,
    //     title: "Slideshow",
    //     fullscreen: true,
    //     isGame: false
    }, {
        title: "Reaction",
        name: "reaction",
        client: ReactionClient,
        presenter: ReactionPresenter,
        fullscreen: true,
        isGame: true,
        description: 'Test audience reflexes in this all-vs-all shape-matching game',
    }];

