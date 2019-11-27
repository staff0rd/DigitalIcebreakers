import React from 'react';
import { Button } from '../pixi/Button';
import { BaseGameProps, BaseGame } from '../BaseGame'
import { Pixi } from '../pixi/Pixi';
import { Colors } from '../../Colors'

export class BuzzerClient extends BaseGame<BaseGameProps, {}> {
    private button: Button;
    app?: PIXI.Application;

    constructor(props: BaseGameProps) {
        super(props);
        this.button = new Button(this.up, this.down);
    }

    init(app: PIXI.Application) {
        this.app = app;
        
        this.app.stage.addChild(this.button);
    }

    down = () => {
        this.props.connection.invoke("hubMessage", JSON.stringify({client: "down"}));
    }

    up = () => {
        this.props.connection.invoke("hubMessage", JSON.stringify({client: "up"}));
    }

    render() {
        if (this.app) {
            this.button.x = this.app.renderer.width / 4;
            this.button.y = this.app.renderer.height / 4;
            this.button.render(Colors.Red.C400, Colors.Blue.C400, 0, 0, this.app.renderer.width / 2, this.app.renderer.height / 2);
        }
        return (
            <Pixi backgroundColor={Colors.BlueGrey.C400} onAppChange={this.init} />
        );
    }
}
