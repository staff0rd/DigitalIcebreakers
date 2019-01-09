import React, { Component } from 'react';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import * as PIXI from "pixi.js";

export class PongPresenter extends Component {
    displayName = PongPresenter.name

    constructor(props, context) {
        super(props, context);

        this.app = new PIXI.Application({ width: window.innerWidth, height: window.innerHeight, backgroundColor: 0xFF0000 });

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

    render() {
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
}
