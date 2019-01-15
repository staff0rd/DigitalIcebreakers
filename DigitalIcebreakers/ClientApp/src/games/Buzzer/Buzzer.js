import React from 'react';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import * as PIXI from "pixi.js";
import { Button } from '../pixi/Button';
import { BaseGame } from '../BaseGame'

export class Buzzer extends BaseGame {
    displayName = Buzzer.name

    constructor(props, context) {
        super(props,context);

        this.app = new PIXI.Application({ width: window.innerWidth, height: window.innerHeight, backgroundColor: 0xFF0000 });

        this.button = new Button(this.up, this.down);
        
        this.app.stage.addChild(this.button);

        this.pixiElement = null;

        this.state = {
            players: []
        };
    }

    componentDidMount() {
        super.componentDidMount();
        this.props.connection.on("gameUpdate", (id, name, state) => {
            var user = {
                id: id,
                name: name,
                state: state
            };

            this.setState(prevState => {
                const players = prevState.players.map(p => p);
                if (!players.filter(p => p.id === user.id).length) {
                    players.push(user);
                }
                players.forEach(p => {
                    if (p.id === user.id)
                        p.state = user.state;
                });
                return { players: players };
            });
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

    renderAdmin() {
      
        const players = (this.state.players || []).map((p, ix) => {
            if (p.state === "down")
                return <ListGroupItem key={ix} active>{p.name}</ListGroupItem>;
            else
                return <ListGroupItem key={ix}>{p.name}</ListGroupItem>;
        });

        return (
            <div>
                <h2>Buzzer</h2>
                <ListGroup>
                    {players}
                </ListGroup>
            </div>
        );
    }

    renderPlayer() {
        this.button.x = this.app.renderer.width / 4;
        this.button.y = this.app.renderer.height / 4;
        this.button.render(0x00FF00, 0x0000FF, 0, 0, this.app.renderer.width / 2, this.app.renderer.height / 2);

        return (
            <div ref={this.pixiUpdate} />
        );
    }

    render() {
        return this.props.isAdmin ? this.renderAdmin() : this.renderPlayer();
    }
}
