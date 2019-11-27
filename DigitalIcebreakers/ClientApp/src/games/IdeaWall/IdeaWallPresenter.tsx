import React, { Fragment } from 'react';
import { Button, Navbar, FormGroup, Modal } from 'react-bootstrap';
import { Colors } from '../../Colors';
import * as Random from '../../Random';
import { Events } from '../../Events';
import { IdeaContainer, Lane } from './IdeaContainer';
import { IdeaView } from './IdeaView';
import { BaseGameProps, BaseGame } from '../BaseGame'
import { Idea } from './Idea'

const WIDTH = 200;
const MARGIN = 5;

const IDEA_COLORS = [
    Colors.Amber.A200,
    Colors.Green.A200,
    Colors.LightGreen.A200,
    Colors.LightBlue.A200,
    Colors.DeepPurple.A100,
    Colors.Red.A100
];

export const StartStopContinueLanes: Lane[] = [
    { name: "Start", id: 0 },
    { name: "Stop", id: 1 },
    { name: "Continue", id: 2 },
]

interface ServerIdea { 
    content: string;
    lane: number;
}

interface ModalProperties {
    title: string;
    body: string;
    action: ((e: React.SyntheticEvent<EventTarget>) => void) | undefined;
}

interface IdeaWallPresenterProps extends BaseGameProps {
    storageKey: string;
    lanes?: Lane[];
    dynamicSize: boolean;
}

interface IdeaWallPresenterState {
    ideas: Idea[],
    showNames: boolean,
    showModal: boolean,
    modal: ModalProperties;
}


export class IdeaWallPresenter extends BaseGame<IdeaWallPresenterProps, IdeaWallPresenterState> {
    displayName = IdeaWallPresenter.name
    ideaContainer?: IdeaContainer;
    app?: PIXI.Application;

    constructor(props: IdeaWallPresenterProps, context: IdeaWallPresenterState) {
        super(props);
        
        this.state = {
            ideas: [],
            showNames: false,
            showModal: false,
            modal: {
                title: "",
                body: "",
                action: undefined
            }
        };
        
        
    }
    
    getRandomColor() {
        return Random.pick(IDEA_COLORS);
    }
    
    saveIdeas() {
        this.saveToStorage(this.props.storageKey, this.state.ideas);
    }
    
    getIdeas() {
        return this.getFromStorage(this.props.storageKey);
    }
    
    clearIdeas() {
        this.clearStorage(this.props.storageKey);
        this.setState({ideas: []}, () => this.init(this.app));
        this.ideaContainer!.reset();
    }
    
    init(app?: PIXI.Application) {
        this.app = app;
        if (this.app) {
            this.ideaContainer = new IdeaContainer(this.app, WIDTH, MARGIN, this.props.lanes || []);
            this.ideaContainer.addToStage(this.app.stage);
            this.setState({ ideas: this.getIdeas() || []}, () => {
                this.ideaContainer!.clear();
                this.state.ideas.forEach(idea => {
                    this.addIdeaToContainer(idea);
                })
            });
            this.setMenuItems();
        }
    }

    closeModal = () => {
        this.setState({showModal: false});
    }

    confirmArrange = () => {
        this.setState({
            showModal: true,
            modal: {
                title: "Arrange ideas?",
                body: "This will re-arrange all ideas",
                action: () => {
                    this.ideaContainer!.arrange();
                    this.closeModal();
                }
            }
        });
    }

    confirmClear = () => {
        this.setState({
            showModal: true,
            modal: {
                title: "Clear all ideas?",
                body: "All ideas will be removed!",
                action: () => {
                    this.clearIdeas();
                    this.closeModal();
                }
            }
        });
    }

    toggleNames = () => {
        this.setState((prevState) => {
            return { showNames: !prevState.showNames};
        }, () => this.init(this.app));
    }

    setMenuItems() {
        const header = (
            <Fragment>
                <Navbar.Form>
                    <FormGroup>
                        <Button bsStyle="primary" onClick={this.confirmClear}>Clear</Button>{' '}
                        <Button bsStyle="primary" onClick={this.toggleNames}>Toggle names</Button>{' '}
                        <Button bsStyle="primary" onClick={this.confirmArrange}>Arrange</Button>
                    </FormGroup>
                </Navbar.Form>
            </Fragment>
        );

        this.props.setMenuItems([header]);
    }

    addIdeaToContainer(idea: Idea, isNew: boolean = false) {
        const view = new IdeaView(idea, this.props.dynamicSize ? 0 : WIDTH, MARGIN, this.state.showNames, this.ideaContainer!.laneWidth, () => this.saveIdeas());
        this.ideaContainer!.add(view, isNew);
    }

    getNewIdea(playerName: string, idea: string | ServerIdea) : Idea {
        let content = (idea as ServerIdea).content || idea as string;
        let lane = (idea as ServerIdea).lane || 0;
        return {playerName: playerName, idea: content, lane: lane, color: this.getRandomColor(), x: undefined, y: undefined};
    }

    componentDidMount() {
        super.componentDidMount();
        
        const resize = () => {
            this.ideaContainer && this.ideaContainer.resize();
        }
        
        resize();
        Events.add('onresize', 'ideawall', resize);
        this.init(this.app);
        this.props.connection.on("gameUpdate", (playerName, idea: string | ServerIdea) => {
            const newIdea = this.getNewIdea(playerName, idea);
            this.addIdeaToContainer(newIdea, true);
            const ideas = [...this.state.ideas, newIdea];
            this.setState({
                ideas: ideas
            }, () => {
                this.saveIdeas();
                this.init(this.app);
            });
        });
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        Events.remove('onresize', 'ideawall');
    }

    render() {
        const pixi = super.render();
        const clearModal = (
            <Modal show={this.state.showModal} onHide={this.closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.state.modal.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>{this.state.modal.body}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle='primary' onClick={this.state.modal.action}>Ok</Button>
                    <Button onClick={this.closeModal}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        );
        return (
            <Fragment>
                {pixi}
                {clearModal}
            </Fragment>
        )
    }
}
