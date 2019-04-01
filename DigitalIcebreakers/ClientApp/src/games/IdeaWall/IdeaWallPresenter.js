import React, { Fragment } from 'react';
import { Button, Navbar, FormGroup } from 'react-bootstrap';
import { PixiPresenter } from '../pixi/PixiPresenter';
import { Colors } from '../../Colors';
import * as PIXI from "pixi.js";

const TITLE_FONT_SIZE = 20;
const BODY_FONT_SIZE = 26;
const STORAGE_KEY = "ideawall:ideas";

export class IdeaWallPresenter extends PixiPresenter {
    displayName = IdeaWallPresenter.name

    constructor(props, context) {
        super(0xFFFFFF, props,context);
        
        this.myStorage = window.localStorage;

        this.state = {
            ideas: []
        };
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
            this.app.stage.removeChildren();
            this.state.ideas.forEach(idea => {
                this.addIdeaToStage(idea);
            })
        });
        this.setMenuItems();
    }

    setMenuItems() {
        const header = (
            <Fragment>
                <Navbar.Form>
                    <FormGroup>
                        <Button bsStyle="primary" onClick={this.reset}>Reset</Button>
                    </FormGroup>
                </Navbar.Form>
            </Fragment>
        );

        this.props.setMenuItems([header]);
    }

    addIdeaToStage(idea) {
        const container = new PIXI.Container();
        const title = new PIXI.Text(idea.playerName, { fontSize: TITLE_FONT_SIZE });
        const body = new PIXI.Text(idea.idea, { fontSize: BODY_FONT_SIZE });
        body.y = title.height;
        container.addChild(title, body);
        container.y = this.app.stage.height;
        this.app.stage.addChild(container);
    }

    componentDidMount() {
        super.componentDidMount();
        this.init();
        this.props.connection.on("gameUpdate", (playerName, idea) => {
            var newIdea = {playerName: playerName, idea: idea};
            this.addIdeaToStage(newIdea);
            const ideas = [...this.state.ideas, newIdea];
            this.setState({
                ideas: ideas
            }, () => this.saveIdeas());
        });
    }

    reset = () => {
        this.clearIdeas();
    }
}
