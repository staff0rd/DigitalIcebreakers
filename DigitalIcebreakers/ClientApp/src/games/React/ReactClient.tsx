import React from 'react';
import { Button } from '../pixi/Button';
import { BaseGameProps } from '../BaseGame'
import { PixiPresenter } from '../pixi/PixiPresenter';
import { Colors } from '../../Colors'
import { Shape } from './Shape';

type ReactClientState = {
    shapes: Shape[];
}

export class ReactClient extends PixiPresenter<BaseGameProps, ReactClientState> {
    private button: Button;

    constructor(props: BaseGameProps) {
        super(Colors.BlueGrey.C400,props);
        this.button = new Button(() =>{}, this.down);
    }

    componentDidMount() {
        super.componentDidMount();
        this.props.connection.on("gameUpdate", (shapes: Shape[]) => {
            console.log(shapes);
            this.setState({
                shapes: shapes
            });
        });
        this.clientMessage("join");
    }

    init() {
        this.app.stage.addChild(this.button);
    }

    down = () => {
        this.props.connection.invoke("hubMessage", JSON.stringify({client: "down"}));
    }

    render() {
        if (this.button) {
            this.button.x = this.app.renderer.width / 4;
            this.button.y = this.app.renderer.height / 4;
            this.button.render(Colors.Red.C400, Colors.Blue.C400, 0, 0, this.app.renderer.width / 2, this.app.renderer.height / 2);
        }
        return (
            <div ref={this.pixiUpdate} />
        );
    }
}
