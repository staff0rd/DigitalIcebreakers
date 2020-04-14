import React from 'react';
import { Button } from '../pixi/Button';
import { BaseGameProps } from '../BaseGame';
import { PongColors as Colors } from './PongColors'
import { PixiView } from '../pixi/PixiView';

interface PongClientState {
    up: number;
    down: number;
}

export class PongClient extends PixiView<BaseGameProps, PongClientState> {
    topButton?: Button;
    bottomButton?: Button;
    
    constructor(props: BaseGameProps) {
        super(Colors.ClientBackground, props);
     
        this.pixiElement = null;
        
        this.state = {
            up: 0xFFFFFF,
            down: 0xFFFFFF
        }
    }
    
    init(): void {
        this.topButton = new Button(this.release, this.up);
        this.bottomButton = new Button(this.release, this.down);

        this.app.stage.addChild(this.topButton);
        this.app.stage.addChild(this.bottomButton);
    }

    changeTeam(up: number, down: number) {
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
        this.clientMessage("join");
    }

    down = () => {
        this.clientMessage("down");
    }

    up = () => {
        this.clientMessage("up");
    }

    release = () => {
        this.clientMessage("release");
    }

    render() {
        if (this.topButton) {
            this.topButton.x = this.app.renderer.width / 4;
            this.topButton.y = this.app.renderer.height / 8;
            this.topButton.render(this.state.up, this.state.down, 0, 0, this.app.renderer.width / 2, this.app.renderer.height / 16 * 5);
        }
        if (this.bottomButton) {
            this.bottomButton.x = this.app.renderer.width / 4;
            this.bottomButton.y = this.app.renderer.height / 16 * 9;
            this.bottomButton.render(this.state.up, this.state.down, 0, 0, this.app.renderer.width / 2, this.app.renderer.height / 16 * 5);
        }

        return (
            <div ref={this.pixiUpdate} />
        );
    }
}
