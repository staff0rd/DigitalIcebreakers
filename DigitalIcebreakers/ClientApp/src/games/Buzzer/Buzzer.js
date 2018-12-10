import React, { Component } from 'react';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import * as PIXI from "pixi.js";

export class Buzzer extends Component {
    displayName = Buzzer.name

    constructor(props, context) {
        super(props,context);

        console.log('isAdmin', props.isAdmin)

        this.app = new PIXI.Application({ width: window.innerWidth, height: window.innerHeight, backgroundColor: 0xFF0000 });

        this.container = new PIXI.Container();
        this.container.interactive = true;
        this.container.buttonMode = true;
        this.g1 = new PIXI.Graphics();
        this.g2 = new PIXI.Graphics();
        this.container.addChild(this.g1);
        this.container.addChild(this.g2);
        this.app.stage.addChild(this.container);

        this.container.on('pointerdown', () => this.down());
        this.container.on('pointerup', () => this.up());
        this.container.on('pointerupoutside', () => this.up());
        console.log("construct");

        this.pixi = null;

        this.state = {
            players: []
        };


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

            //switch (state) {
            //    case "up": this.setState(prevState => { return { players: [...prevState.players.filter(p => p.id !== user.id), user] }; }); break;
            //    case "down": this.setState(prevState => { return { players: [user, ...prevState.players.filter(p => p.id !== user.id)] }; }); break;
            //    default: break;
            //}
        });
    }

    pixiUpdate = (element) => {
        this.pixi = element;

        if (this.pixi && this.pixi.children.length <= 0) {
            this.pixi.appendChild(this.app.view);
        }
    }

    down = () => {
        this.g2.alpha = 0;
        this.props.connection.invoke("gameMessage", "down");
    }

    up = () => {
        this.g2.alpha = 1;
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

        this.container.x = this.app.renderer.width / 4;
        this.container.y = this.app.renderer.height / 4;
        
        this.g1.clear();
        this.g1.beginFill(0x00FF00);
        this.g1.drawRect(0, 0, this.app.renderer.width / 2, this.app.renderer.height / 2);
        this.g1.endFill();
        this.g2.clear();
        this.g2.beginFill(0x0000FF);
        this.g2.drawRect(0, 0, this.app.renderer.width / 2, this.app.renderer.height / 2);
        this.g2.endFill();

        console.log('render');

        return (
            <div ref={this.pixiUpdate} />
        );
    }

    render() {
        return this.props.isAdmin ? this.renderAdmin() : this.renderPlayer();
    }
}
