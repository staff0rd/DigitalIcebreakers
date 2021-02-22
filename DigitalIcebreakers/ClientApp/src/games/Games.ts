import { ReactNode } from "react";
import DoggosVsKittehsClient from "./DoggosVsKittehs/DoggosVsKittehsClient";
import DoggosVsKittehsPresenter from "./DoggosVsKittehs/DoggosVsKittehsPresenter";
import { BroadcastClient } from "./Broadcast/BroadcastClient";
import { BroadcastPresenter } from "./Broadcast/BroadcastPresenter";
import NamePickerClient from "./NamePicker/NamePickerClient";
import NamePickerPresenter from "./NamePicker/NamePickerPresenter";
import NamePickerMenu from "./NamePicker/NamePickerMenu";
import YesNoMaybePresenter from "./YesNoMaybe/YesNoMaybePresenter";
import { YesNoMaybeMenu } from "./YesNoMaybe/YesNoMaybeMenu";
import YesNoMaybeClient from "./YesNoMaybe/YesNoMaybeClient";
import { Name as YesNoMaybeName } from "./YesNoMaybe/YesNoMaybeReducer";
import { IdeaWallClient } from "./IdeaWall/IdeaWallClient";
import IdeaWallPresenter from "./IdeaWall/IdeaWallPresenter";
import IdeaWallMenu from "./IdeaWall/IdeaWallMenu";
import BuzzerClient from "./Buzzer/BuzzerClient";
import BuzzerPresenter from "./Buzzer/BuzzerPresenter";
import SplatClient from "./Splat/SplatClient";
import SplatPresenter from "./Splat/SplatPresenter";
import PongPresenter from "./Pong/PongPresenter";
import { PongClient } from "./Pong/PongClient";
import PongMenu from "./Pong/PongMenu";
import { ReactionPlayer } from "./Reaction/ReactionClient";
import { ReactionPresenter } from "./Reaction/ReactionPresenter";
import { Name as PollName } from "./Poll";
import { PollPresenter } from "./Poll/PollPresenter";
import PollClient from "./shared/Poll/Client";
import { TriviaPresenter } from "./Trivia/TriviaPresenter";
import { Name as TriviaName } from "./Trivia";
import { RouteLink } from "../layout/useRoutes";
import LiveHelp from "@material-ui/icons/LiveHelp";
import EditQuestions from "./shared/Poll/components/EditQuestions";
import EditQuestion from "./shared/Poll/components/EditQuestion";
import { Name as IdeaWallName } from "./IdeaWall/IdeaWallReducer";
import * as Retrospective from "./Retrospective";
import { Name as FistOfFiveName } from "./FistOfFive/reducer";
import FistOfFivePresenter from "./FistOfFive/FistOfFivePresenter";

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

const pollAndTriviaRoutes = [
  {
    component: EditQuestions,
    path: "/questions",
    icon: LiveHelp,
    name: "Questions",
  },
  {
    component: EditQuestion,
    path: "/questions/:id",
  },
];

const games: Game[] = [
  {
    title: "Poll",
    name: PollName,
    client: PollClient,
    presenter: PollPresenter,
    description: "Audience polling: Add questions and poll your audience.",
    routes: pollAndTriviaRoutes,
  },
  {
    isNew: true,
    title: "Fist of Five",
    name: FistOfFiveName,
    client: PollClient,
    presenter: FistOfFivePresenter,
    description:
      "Quickly getting feedback or gauging consensus during a meeting",
  },
  {
    title: "Trivia",
    name: TriviaName,
    client: PollClient,
    presenter: TriviaPresenter,
    description:
      "Like polling but with a scoreboard: Add or generate questions and run a trivia session.",
    routes: pollAndTriviaRoutes,
  },
  {
    isNew: true,
    title: "Retrospective",
    name: Retrospective.Name,
    client: Retrospective.Participant,
    presenter: Retrospective.Presenter,
    description: "Run a retrospective with your team",
    menu: Retrospective.Menu,
  },
  {
    name: "doggos-vs-kittehs",
    client: DoggosVsKittehsClient,
    presenter: DoggosVsKittehsPresenter,
    title: "Doggos vs Kittehs",
    description: "Audience polling - Furry friend edition",
  },
  {
    name: "name-picker",
    menu: NamePickerMenu,
    client: NamePickerClient,
    presenter: NamePickerPresenter,
    title: "Name Picker",
    description: "Pick a name, out of a hat! (or a swirling void)",
  },
  {
    name: YesNoMaybeName,
    client: YesNoMaybeClient,
    presenter: YesNoMaybePresenter,
    menu: YesNoMaybeMenu,
    title: "Yes, No, Maybe",
    description:
      "Audience polling - ask your audience questions and get real-time feedback",
  },
  {
    name: "buzzer",
    client: BuzzerClient,
    presenter: BuzzerPresenter,
    title: "Buzzer",
    description: "Let your audience get a feel for low latency",
  },
  {
    name: "splat",
    client: SplatClient,
    presenter: SplatPresenter,
    title: "Splat",
    description: "It's paint-ball for audiences and presenters",
  },
  {
    name: "pong",
    client: PongClient,
    presenter: PongPresenter,
    menu: PongMenu,
    title: "Pong",
    description: "Mob pong for large audiences - red vs blue!",
  },
  {
    name: IdeaWallName,
    client: IdeaWallClient,
    presenter: IdeaWallPresenter,
    menu: IdeaWallMenu,
    title: "Idea Wall",
    description:
      "A virtual wall of ideas. Stick 'em to the wall and move them around",
  },
  {
    name: "broadcast",
    client: BroadcastClient,
    presenter: BroadcastPresenter,
    title: "Broadcast",
    description:
      "Demonstration of two-way, real-time presenter and audience participation",
  },
  {
    title: "Reaction",
    name: "reaction",
    client: ReactionPlayer,
    presenter: ReactionPresenter,
    description:
      "Test audience reflexes in this all-vs-all shape-matching game",
  },
];

export default games;
