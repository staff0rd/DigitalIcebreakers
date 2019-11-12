import { BaseGameProps } from '../BaseGame'
import { PixiPresenter } from '../pixi/PixiPresenter';
import { Colors } from '../../Colors'
import { Shape } from './Shape';
import * as PIXI from "pixi.js";

type ReactClientState = {
    shapes: Shape[];
    selectedId: number;
}

export class ReactClient extends PixiPresenter<BaseGameProps, ReactClientState> {

    constructor(props: BaseGameProps) {
        super(Colors.White,props);
    }

    componentDidMount() {
        super.componentDidMount();
        this.props.connection.on("gameUpdate", (newState: ReactClientState) => {
            console.log(newState);
            this.setState(newState, () => this.init());
        });
    }

    init() {
       if (this.state) {
           this.app.stage.removeChildren();
           const margin = 25;
           const radius = Math.min(
               (this.app.screen.width - (3*margin)) / 4,
               ((this.app.screen.height - (this.state.shapes.length/2 + 1) * margin)) / 4
               );
           for (let i = 0; i < this.state.shapes.length; i += 2) {
                const g1 = this.drawShape(this.state.shapes[i], radius);
                const g2 = this.drawShape(this.state.shapes[i+1], radius, radius * 3 + margin)
                const container = new PIXI.Container();
                container.addChild(g1, g2);
                container.position.set(this.app.screen.width/2 - container.width/2, margin + (i/2 * (radius*2 + margin)))
                this.app.stage.addChild(container);
           }
       }
    }

    private drawShape(shape: Shape, radius: number, leftOffset = radius) {
        const g = new PIXI.Graphics();
        let alpha = 1;
        if (this.state.selectedId === null) {
            g.on('pointerdown', () => this.select(shape.id));
            g.buttonMode = true;
            g.interactive = true;
        } else
            alpha = .5;
        if (this.state.selectedId === shape.id) {
            g.lineStyle(5, Colors.BlueGrey.C900);
            alpha = 1;
        }
        g.beginFill(shape.color, alpha)
            .drawCircle(leftOffset, radius, radius)
            .endFill();
        return g;
    }

    private select(id: number) {
        this.setState({
            selectedId: id
        }, () => {
            super.clientMessage(id)
            this.init();
        });
    }
}
