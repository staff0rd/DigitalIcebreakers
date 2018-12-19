import React, { Component } from 'react';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import * as PIXI from "pixi.js";
import { Button } from '../pixi/Button';

export class Pong extends Component {
    displayName = Pong.name

    constructor(props, context) {
        super(props, context);

        this.app = new PIXI.Application({ width: window.innerWidth, height: window.innerHeight, backgroundColor: 0xFF0000 });

        this.topButton = new Button(this.release, this.up);
        this.bottomButton = new Button(this.release, this.down);

        this.app.stage.addChild(this.topButton);
        this.app.stage.addChild(this.bottomButton);

        this.pixiElement = null;

        this.state = {
            players: []
        };

        this.props.connection.on("gameUpdate", (response) => {
            console.log(response);
        });
    }

    pixiUpdate = (element) => {
        this.pixiElement = element;

        if (this.pixiElement && this.pixiElement.children.length <= 0) {
            this.pixiElement.appendChild(this.app.view);
        }
    }

    down = () => {
        this.props.connection.invoke("gameMessage", "down");
    }

    up = () => {
        this.props.connection.invoke("gameMessage", "up");
    }

    release = () => {
        this.props.connection.invoke("gameMessage", "release");
    }

    renderAdmin() {

        const players = (this.state.players || []).map((p, ix) => {
            if (p.state === "down")
                return <ListGroupItem key={ix} active>{p.name}</ListGroupItem>;
            else
                return <ListGroupItem key={ix}>{p.name}</ListGroupItem>;
        });

        return (
            <div>
                <h2>Pong</h2>
                <ListGroup>
                    {players}
                </ListGroup>
            </div>
        );
    }

    renderPlayer() {
        this.topButton.x = this.app.renderer.width / 4;
        this.topButton.y = this.app.renderer.height / 8;
        this.topButton.render(0x00FF00, 0x0000FF, 0, 0, this.app.renderer.width / 2, this.app.renderer.height / 16 * 5);

        this.bottomButton.x = this.app.renderer.width / 4;
        this.bottomButton.y = this.app.renderer.height / 16 * 9;
        this.bottomButton.render(0x00FF00, 0x0000FF, 0, 0, this.app.renderer.width / 2, this.app.renderer.height / 16 * 5);

        return (
            <div ref={this.pixiUpdate} />
        );
    }

    render() {
        return this.props.isAdmin ? this.renderAdmin() : this.renderPlayer();
    }
}
