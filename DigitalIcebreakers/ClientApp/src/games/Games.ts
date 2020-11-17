import React, { ReactNode } from 'react';
import DoggosVsKittehsClient from './DoggosVsKittehs/DoggosVsKittehsClient';
import DoggosVsKittehsPresenter from './DoggosVsKittehs/DoggosVsKittehsPresenter';
import { BroadcastClient } from './Broadcast/BroadcastClient';
import { BroadcastPresenter } from './Broadcast/BroadcastPresenter';
import NamePickerClient from './NamePicker/NamePickerClient';
import NamePickerPresenter from './NamePicker/NamePickerPresenter';
import NamePickerMenu from './NamePicker/NamePickerMenu';
import YesNoMaybePresenter from './YesNoMaybe/YesNoMaybePresenter';
import { YesNoMaybeMenu } from "./YesNoMaybe/YesNoMaybeMenu";
import YesNoMaybeClient from './YesNoMaybe/YesNoMaybeClient';
import { Name as YesNoMaybeName, yesNoMaybeReducer } from './YesNoMaybe/YesNoMaybeReducer';
import { IdeaWallClient } from './IdeaWall/IdeaWallClient';
import IdeaWallPresenter, { StartStopContinueLanes } from './IdeaWall/IdeaWallPresenter';
import IdeaWallMenu from './IdeaWall/IdeaWallMenu';
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
import { Name as PollName } from './Poll';
import PollPresenter from './Poll/PollPresenter';
import PollClient from './Poll/PollClient';
import { RouteLink } from '../layout/routes';
import LiveHelp from '@material-ui/icons/LiveHelp';
import EditQuestions from './Poll/components/EditQuestions';
import EditQuestion from './Poll/components/EditQuestion';

interface Game {
    name: string;
    client: ReactNode;
    presenter: ReactNode;
    title: string;
    description: string;
    menu?: ReactNode;
    routes?: RouteLink[];
    isNew?: boolean;
}

const games: Game[] = [{
        isNew: true,
        title: 'Poll',
        name: PollName,
        client: PollClient,
        presenter: PollPresenter,
        description: 'Audience polling: Add questions and poll your audience',
        routes: [{
            component: EditQuestions,
            path: '/questions',
            icon: LiveHelp,
            name: 'Questions'
        },{
            component: EditQuestion,
            path: '/questions/:id'
        }]
    },{
        name: "doggos-vs-kittehs",
        client: DoggosVsKittehsClient,
        presenter: DoggosVsKittehsPresenter,
        title: "Doggos vs Kittehs",
        description: "Audience polling - Furry friend edition",
    },{
        name: "namepicker",
        isNew: true,
        menu: NamePickerMenu,
        client: NamePickerClient,
        presenter: NamePickerPresenter,
        title: "Name Picker",
        description: "Pick a name, out of a hat! (or a swirling void)",
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
        description: "Let your audience get a feel for low latency"
    }, {
        isNew: true,
        name: "splat",
        client: SplatClient,
        presenter: SplatPresenter,
        title: "Splat",
        description: "It's paint-ball for audiences and presenters"
    }, {
        name: "pong",
        client: PongClient,
        presenter: PongPresenter,
        menu: PongMenu,
        title: "Pong",
        description: 'Mob pong for large audiences - red vs blue!'
    }, {
        name: "ideawall",
        client: IdeaWallClient,
        presenter: IdeaWallPresenter,
        menu: IdeaWallMenu,
        title: "Idea Wall",
        description: "A virtual wall of ideas. Stick 'em to the wall and move them around",
    //}, {
    //     name: "startstopcontinue",
    //     client: <StartStopContinueClient,
    //     presenter: <IdeaWallPresenter dynamicSize={true} {...props} storageKey="startstopcontinue:ideas" lanes={StartStopContinueLanes} />,
    //     title: "Start Stop Continue",
    }, {
        name: "broadcast",
        client: BroadcastClient,
        presenter: BroadcastPresenter,
        title: "Broadcast",
        description: 'Demonstration of two-way, real-time presenter and audience participation',
    // }, {
    //     name: "slideshow",
    //     client: <SlideshowClient,
    //     presenter: <SlideshowPresenter {...props} storageKey="slideshow:state" />,
    //     title: "Slideshow",
    }, {
        title: "Reaction",
        name: "reaction",
        client: ReactionClient,
        presenter: ReactionPresenter,
        description: 'Test audience reflexes in this all-vs-all shape-matching game',
    }
];

export default games;
