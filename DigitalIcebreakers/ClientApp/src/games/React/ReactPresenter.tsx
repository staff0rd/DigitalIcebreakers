import React from 'react';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import { BaseGameProps } from '../BaseGame'
import { Shape } from './Shape';
import { Colors } from '../../Colors';
import { ShapeType } from './ShapeType';
import { pick } from '../../Random';
import { PixiPresenter } from '../pixi/PixiPresenter';
import * as PIXI from "pixi.js";

interface Player {
    id: string;
    name: string;
    choice: number;
}

interface ReactState {
    players: Player[];
    shapes: Shape[],
    shape: Shape|undefined
}

export class ReactPresenter extends PixiPresenter<BaseGameProps, ReactState> {
    constructor(props: BaseGameProps) {
        super(Colors.White, props);

        this.state = {
            players: [],
            shapes: [],
            shape: undefined
        };
    }

    init() {
        if (this.state.shape) {
            this.app.stage.removeChildren();
            const g = new PIXI.Graphics().beginFill(this.state.shape.color).drawCircle(0, 0, 150).endFill();
            g.position.set(this.app.screen.width/2, this.app.screen.height/2);
            this.app.stage.addChild(g);
        }
    }

    componentDidMount() {
        super.componentDidMount();
        this.props.connection.on("gameUpdate", (id, name, choice) => {
            var user = {
                id: id,
                name: name,
                choice: choice
            };

            this.setState(prevState => {
                const players = prevState.players.map((p: Player) => p);
                if (!players.filter((p:Player) => p.id === user.id).length) {
                    players.push(user);
                }
                players.forEach((p: Player) => {
                    if (p.id === user.id)
                        p.choice = user.choice;
                });
                return { players: players };
            });
        });
        this.setShape();
    }

    setShape() {
        const shapes = [
          { id: 0, color: Colors.Red.C500, type: ShapeType.Circle },
          { id: 1, color: Colors.Green.C500, type: ShapeType.Circle},
          { id: 2, color: Colors.Blue.C500, type: ShapeType.Circle}  
        ];

        this.setState({
            shapes: shapes,
            shape: pick(shapes)
        }, () => {
            this.adminMessage(this.state.shapes);
            this.init();
        });
    }
}
