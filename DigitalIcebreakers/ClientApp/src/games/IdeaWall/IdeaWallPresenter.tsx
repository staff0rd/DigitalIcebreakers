import React from "react";
import { Events } from "../../Events";
import { IdeaContainer, Lane } from "./IdeaContainer";
import { IdeaView } from "./IdeaView";
import { BaseGameProps, BaseGame } from "../BaseGame";
import { Idea } from "./Idea";
import { connect, ConnectedProps } from "react-redux";
import { Pixi } from "../pixi/Pixi";
import {
  ideaUpdatedAction,
  clearIdeasAction,
  loadIdeasAction,
  arrangeIdeasAction,
} from "./IdeaWallReducer";
import { RootState } from "../../store/RootState";

const WIDTH = 200;
const MARGIN = 5;

interface IdeaWallPresenterProps extends BaseGameProps {
  storageKey: string;
  lanes?: Lane[];
  dynamicSize: boolean;
}

interface IdeaWallPresenterState {
  ideas: Idea[];
  showNames: boolean;
}

const connector = connect((state: RootState) => state.games.ideawall, {
  ideaUpdatedAction,
  clearIdeasAction,
  loadIdeasAction,
  arrangeIdeasAction,
});

type PropsFromRedux = ConnectedProps<typeof connector> & IdeaWallPresenterProps;

class IdeaWallPresenter extends BaseGame<
  PropsFromRedux,
  IdeaWallPresenterState
> {
  displayName = IdeaWallPresenter.name;
  ideaContainer?: IdeaContainer;
  app?: PIXI.Application;

  constructor(props: PropsFromRedux) {
    super(props);

    this.state = {
      ideas: [],
      showNames: false,
    };
  }

  init(app: PIXI.Application) {
    this.app = app;
    this.draw();
  }

  draw() {
    if (this.app) {
      this.app.stage.removeChildren();
      this.ideaContainer = new IdeaContainer(
        this.app,
        WIDTH,
        MARGIN,
        this.props.lanes || []
      );
      this.ideaContainer.addToStage(this.app.stage);

      this.ideaContainer!.clear();
      this.props.ideas.forEach((idea) => {
        this.addIdeaToContainer(idea);
      });
    }
  }

  ideaUpdated = (idea: Idea) => {
    this.props.ideaUpdatedAction(idea);
  };

  addIdeaToContainer(idea: Idea, isNew: boolean = false) {
    const view = new IdeaView(
      idea,
      this.props.dynamicSize ? 0 : WIDTH,
      MARGIN,
      this.props.showNames,
      this.ideaContainer!.laneWidth,
      (idea) => this.ideaUpdated(idea)
    );
    this.ideaContainer!.add(view, isNew);
  }

  componentDidMount() {
    const resize = () => {
      this.ideaContainer && this.ideaContainer.resize();
    };

    resize();
    Events.add("onresize", "ideawall", resize);
    this.props.loadIdeasAction();
    this.draw();
  }

  componentDidUpdate() {
    if (this.app) {
      if (this.props.ideas.length) {
        this.props.ideas.forEach((idea) => {
          if (!this.ideaContainer!.containsIdea(idea)) {
            this.addIdeaToContainer(idea, true);
          }
        });
      } else {
        this.ideaContainer!.reset();
      }
      if (this.props.pendingArrange) {
        this.ideaContainer!.arrange();
        this.props.arrangeIdeasAction(false);
      }
      this.draw();
    }
  }

  componentWillUnmount() {
    Events.remove("onresize", "ideawall");
  }

  render() {
    return <Pixi onAppChange={(app) => this.init(app)} />;
  }
}

export default connector(IdeaWallPresenter);
