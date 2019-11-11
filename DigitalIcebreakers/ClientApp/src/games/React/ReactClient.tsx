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
        super(Colors.BlueGrey.C400,props);
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
                const g1 = new PIXI.Graphics();

                if (this.state.selectedId === this.state.shapes[i].id)
                    g1.lineStyle(5, Colors.BlueGrey.C900);
                    
                g1.beginFill(this.state.shapes[i].color)
                    .drawCircle(radius, radius, radius)
                    .endFill();
                    
                if (this.state.selectedId === null ) {
                    g1.on('pointerdown', () => this.select(this.state.shapes[i].id));
                    g1.buttonMode = true;
                    g1.interactive = true;
                }
                
                const g2 = new PIXI.Graphics();
                
                if (this.state.selectedId === this.state.shapes[i+1].id)
                    g2.lineStyle(5, Colors.BlueGrey.C900);

                g2.beginFill(this.state.shapes[i+1].color)
                    .drawCircle(radius * 3 + margin, radius, radius)
                    .endFill();
                
                if (this.state.selectedId === null ) {
                    g2.on('pointerdown', () => this.select(this.state.shapes[i+1].id))
                    g2.buttonMode = true;
                    g2.interactive = true;
                }
                
                const container = new PIXI.Container();
                container.addChild(g1, g2);
                container.position.set(this.app.screen.width/2 - container.width/2, margin + (i/2 * (radius*2 + margin)))
                this.app.stage.addChild(container);
           }

       }
    }

    private select(id: number) {
        this.setState({
            selectedId: id
        }, () => this.init());
    }

    down = () => {
        this.props.connection.invoke("hubMessage", JSON.stringify({client: "down"}));
    }
}
