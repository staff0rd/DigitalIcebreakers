import React from 'react';
import * as PIXI from "pixi.js";
import { Button } from '../pixi/Button';
import { BaseGame } from '../BaseGame';
import { PongColors as Colors } from './PongColors'

export class PongClient extends BaseGame {
    displayName = PongClient.name

    constructor(props, context) {
        super(props, context);

        console.log('constructed ' + PongClient.name);

        this.app = new PIXI.Application({ width: window.innerWidth, height: window.innerHeight, backgroundColor: Colors.ClientBackground });

        this.topButton = new Button(this.release, this.up);
        this.bottomButton = new Button(this.release, this.down);

        this.app.stage.addChild(this.topButton);
        this.app.stage.addChild(this.bottomButton);

        this.pixiElement = null;

        this.state = {
            up: 0xFFFFFF,
            down: 0xFFFFFF
        }
    }

    changeTeam(up, down) {
        this.setState({up: up, down: down});
    }

    componentDidMount() {
        super.componentDidMount();
        this.props.connection.on("gameUpdate", (response) => {
            const result = response.split(":");
            if (result[0] === "team") {
                switch(result[1]) {
                    case "0": this.changeTeam(Colors.LeftPaddleUp, Colors.LeftPaddleDown); break;
                    case "1": this.changeTeam(Colors.RightPaddleUp, Colors.RightPaddleDown); break;
                    default: this.unexpected(response);
                }
            } else {
                this.unexpected(response);
            }
        });
        this.props.connection.invoke("gameMessage", "ready:pong");
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

    render() {
        this.topButton.x = this.app.renderer.width / 4;
        this.topButton.y = this.app.renderer.height / 8;
        this.topButton.render(this.state.up, this.state.down, 0, 0, this.app.renderer.width / 2, this.app.renderer.height / 16 * 5);

        this.bottomButton.x = this.app.renderer.width / 4;
        this.bottomButton.y = this.app.renderer.height / 16 * 9;
        this.bottomButton.render(this.state.up, this.state.down, 0, 0, this.app.renderer.width / 2, this.app.renderer.height / 16 * 5);

        return (
            <div ref={this.pixiUpdate} />
        );
    }
}
