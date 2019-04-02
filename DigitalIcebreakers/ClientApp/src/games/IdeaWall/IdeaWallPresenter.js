import React, { Fragment } from 'react';
import { Button, Navbar, FormGroup } from 'react-bootstrap';
import { PixiPresenter } from '../pixi/PixiPresenter';
import { Colors } from '../../Colors';
import * as PIXI from "pixi.js";
import * as Random from '../../Random';
import { Events } from '../../Events';
import { IdeaContainer } from './IdeaContainer';


const TITLE_FONT_SIZE = 20;
const BODY_FONT_SIZE = 26;
const STORAGE_KEY = "ideawall:ideas";
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

export class IdeaWallPresenter extends PixiPresenter {
    displayName = IdeaWallPresenter.name

    constructor(props, context) {
        super(0xFFFFFF, props,context);
        
        this.myStorage = window.localStorage;

        this.state = {
            ideas: [],
            showNames: false
        };

        this.ideaContainer = new IdeaContainer(this.app, WIDTH);
        this.app.stage.addChild(this.ideaContainer.getDragContainer(), this.ideaContainer);
    }

    

    getRandomColor() {
        return Random.pick(IDEA_COLORS);
    }

    saveIdeas() {
        if (this.myStorage) {
            this.myStorage.setItem(STORAGE_KEY, JSON.stringify(this.state.ideas));
        }
        console.log(this.state.ideas);
    }

    getIdeas() {
        if (this.myStorage) {
            const raw = this.myStorage.getItem(STORAGE_KEY);
            if (raw) {
                return JSON.parse(raw);
            }
        }
    }

    clearIdeas() {
        if (this.myStorage) {
            this.myStorage.removeItem(STORAGE_KEY);
        }
        this.setState({ideas: []}, () => this.init());
    }

    init() {
        this.setState({ ideas: this.getIdeas() || []}, () => {
            this.ideaContainer.removeChildren();
            this.state.ideas.forEach(idea => {
                this.addIdeaToContainer(idea);
            })
        });
        this.setMenuItems();
    }

    setMenuItems() {
        const header = (
            <Fragment>
                <Navbar.Form>
                    <FormGroup>
                        <Button bsStyle="primary" onClick={this.clear}>Clear</Button>{' '}
                        <Button bsStyle="primary" onClick={this.toggleNames}>Toggle names</Button>
                    </FormGroup>
                </Navbar.Form>
            </Fragment>
        );

        this.props.setMenuItems([header]);
    }

    addIdeaToContainer(idea) {
        const container = new PIXI.Container();
        const graphics = new PIXI.Graphics();
        graphics.beginFill(idea.color);
        graphics.drawRect(0, 0, WIDTH, WIDTH);
        graphics.endFill();
        const title = new PIXI.Text(idea.playerName, { fontSize: TITLE_FONT_SIZE });
        title.x = MARGIN;
        title.visible = this.state.showNames;
        const body = new PIXI.Text(idea.idea, { fontSize: BODY_FONT_SIZE, breakWords: true, wordWrap: true, wordWrapWidth: WIDTH - 2*MARGIN, align: "center"});
        body.pivot.set(body.width/2, body.height/2)
        body.position.set(WIDTH / 2, WIDTH / 2);
        container.addChild(graphics, title, body);
        container.y = this.ideaContainer.height + (this.ideaContainer.children.length ? MARGIN : 0);
        this.ideaContainer.addChild(container);
    }

    getNewIdea(playerName, idea) {
        return {playerName: playerName, idea: idea, color: this.getRandomColor()};
    }

    componentDidMount() {
        super.componentDidMount();
        
        const resize = () => {
            this.ideaContainer.resize();
        }
        
        resize();
        Events.add('onresize', 'ideawall', resize);
        this.init();
        this.props.connection.on("gameUpdate", (playerName, idea) => {
            const newIdea = this.getNewIdea(playerName, idea);
            this.addIdeaToContainer(newIdea);
            const ideas = [...this.state.ideas, newIdea];
            this.setState({
                ideas: ideas
            }, () => {
                this.saveIdeas();
                this.init;
            });
        });
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        Events.remove('onresize', 'ideawall');
    }

    clear = () => {
        this.clearIdeas();
    }

    toggleNames = () => {
        this.setState((prevState) => {
            return { showNames: !prevState.showNames};
        }, () => this.init());
    }
}
