import React, { Fragment } from 'react';
import { Button, Navbar, FormGroup, Modal } from 'react-bootstrap';
import { PixiPresenter } from '../pixi/PixiPresenter';
import { Colors } from '../../Colors';
import * as Random from '../../Random';
import { Events } from '../../Events';
import { IdeaContainer, Lane } from './IdeaContainer';
import { IdeaView } from './IdeaView';
import { BaseGameProps } from '../BaseGame'
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
    Content: string;
    Lane: number;
}

interface ModalProperties {
    title: string;
    body: string;
    action: ((e: React.SyntheticEvent<EventTarget>) => void) | undefined;
}

interface IdeaWallPresenterProps extends BaseGameProps {
    setMenuItems(items: JSX.Element[]): void;
    storageKey: string;
    lanes?: Lane[];
}

interface IdeaWallPresenterState {
    ideas: Idea[],
    showNames: boolean,
    showModal: boolean,
    modal: ModalProperties;
}


export class IdeaWallPresenter extends PixiPresenter<IdeaWallPresenterProps, IdeaWallPresenterState> {
    displayName = IdeaWallPresenter.name
    myStorage: Storage;
    ideaContainer: IdeaContainer;

    constructor(props: IdeaWallPresenterProps, context: IdeaWallPresenterState) {
        super(0xFFFFFF, props);
        
        this.myStorage = window.localStorage;

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

        this.ideaContainer = new IdeaContainer(this.app, WIDTH, MARGIN, this.props.lanes || []);
        this.ideaContainer.addToStage(this.app.stage);
    }

    getRandomColor() {
        return Random.pick(IDEA_COLORS);
    }

    saveIdeas() {
        if (this.myStorage) {
            this.myStorage.setItem(this.props.storageKey, JSON.stringify(this.state.ideas));
        }
    }

    getIdeas() {
        if (this.myStorage) {
            const raw = this.myStorage.getItem(this.props.storageKey);
            if (raw) {
                return JSON.parse(raw);
            }
        }
    }

    clearIdeas() {
        if (this.myStorage) {
            this.myStorage.removeItem(this.props.storageKey);
        }
        this.setState({ideas: []}, () => this.init());
        this.ideaContainer.reset();
    }

    init() {
        this.setState({ ideas: this.getIdeas() || []}, () => {
            this.ideaContainer.clear();
            this.state.ideas.forEach(idea => {
                this.addIdeaToContainer(idea);
            })
        });
        this.setMenuItems();
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
                    this.ideaContainer.arrange();
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
        }, () => this.init());
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
        const view = new IdeaView(idea, WIDTH, MARGIN, this.state.showNames, () => this.saveIdeas());
        this.ideaContainer.add(view, isNew);
    }

    getNewIdea(playerName: string, idea: string | ServerIdea) : Idea {
        let content = (idea as ServerIdea).Content || idea as string;
        let lane = (idea as ServerIdea).Lane || 0;
        return {playerName: playerName, idea: content, lane: lane, color: this.getRandomColor(), x: undefined, y: undefined};
    }

    componentDidMount() {
        super.componentDidMount();
        
        const resize = () => {
            this.ideaContainer.resize();
        }
        
        resize();
        Events.add('onresize', 'ideawall', resize);
        this.init();
        this.props.connection.on("gameUpdate", (playerName, idea: string | ServerIdea) => {
            const newIdea = this.getNewIdea(playerName, idea);
            this.addIdeaToContainer(newIdea, true);
            const ideas = [...this.state.ideas, newIdea];
            this.setState({
                ideas: ideas
            }, () => {
                this.saveIdeas();
                this.init();
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
