import { BaseGameProps, BaseGame } from '../BaseGame'
import { Colors } from '../../Colors'
import { Shape } from './Shape';
import * as PIXI from "pixi.js";
import { drawShape } from './ShapeView';
import { Pixi } from '../pixi/Pixi';
import { ConnectedProps, connect } from 'react-redux';
import { clientMessage } from '../../store/lobby/actions';
import React from 'react';
import { setGameMessageCallback } from '../../store/connection/actions'

type ReactionClientState = {
    shapes: Shape[];
    selectedId?: number;
}

const connector = connect(
    null,
    { clientMessage, setGameMessageCallback }
);
  
type PropsFromRedux = ConnectedProps<typeof connector> & BaseGameProps;

class ReactionClient extends BaseGame<PropsFromRedux, ReactionClientState> {
    app?: PIXI.Application;

    constructor(props: PropsFromRedux) {
        super(props);
        this.state = {
            shapes: []
        }
    }

    componentDidMount() {
        window.addEventListener("resize", () => setTimeout(() => this.resize(), 501));
        this.props.setGameMessageCallback((newState: ReactionClientState) => {
            console.log(newState);
            this.setState(newState, () => this.init(this.app));
        });
    }

    componentWillUnmount() {
        window.removeEventListener("resize", () => this.resize());
    }

    init(app?: PIXI.Application) {
        this.app = app || this.app;
        this.resize();
    }
    
    resize() {
        if (this.app) {
            console.log('performing layout');
            this.app.stage.removeChildren();
            const margin = 25;
            const radius = Math.min(
                (this.app.screen.width - (3*margin)) / 4,
                ((this.app.screen.height - (this.state.shapes.length/2 + 1) * margin)) / 6
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
        g.beginFill(shape.color, alpha);

        return drawShape(g, shape.type, leftOffset, radius, radius).endFill();
    }

    private select(id: number) {
        this.setState({
            selectedId: id
        }, () => {
            this.props.clientMessage(id)
            this.init();
        });
    }

    render() {
        return <Pixi backgroundColor={Colors.White} onAppChange={(app) => this.init(app)} />
    }
}

export default connector(ReactionClient);