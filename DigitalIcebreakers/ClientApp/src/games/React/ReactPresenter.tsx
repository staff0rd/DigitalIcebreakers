import React from 'react';
import { Button } from 'react-bootstrap';
import { BaseGameProps } from '../BaseGame'
import { Shape } from './Shape';
import { Colors } from '../../Colors';
import { ShapeType } from './ShapeType';
import { shuffle } from '../../Random';
import { PixiPresenter } from '../pixi/PixiPresenter';
import * as PIXI from "pixi.js";
import { ShapeView } from './ShapeView';

interface Player {
    id: string;
    name: string;
    choice: number;
}

interface Score {
    id: string;
    name: string;
    score: number;
}

interface ReactState {
    players: Player[];
    shapes: Shape[],
    shape: Shape|undefined,
    views: ShapeView[],
    showScores: boolean,
    scores: Score[]
}

export class ReactPresenter extends PixiPresenter<BaseGameProps, ReactState> {
    private timeout: NodeJS.Timeout|undefined;
    constructor(props: BaseGameProps) {
        super(Colors.White, props);

        this.state = {
            players: [],
            shapes: [],
            shape: undefined,
            views: [],
            showScores: false,
            scores: []
        };
    }
    
    private getOtherShapes() {
        return this.state.shapes.filter(shape => shape.id !== this.state.shape!.id);
    }

    init() {
        if (this.state.shape) {
            this.app.stage.removeChildren();
            const bottomShapes = this.getOtherShapes();
            const size = this.app.screen.height * .7;
            const main = new ShapeView(size, this.state.shape);
            main.view.position.set(this.app.screen.width/2, size/2);           
            const bottomShapesContainer = new PIXI.Container();
            const views = [main]

            let smallShapeWidth: number = 0;
            const shapeMargin = 20;
            bottomShapes
                .forEach(shape => {
                    const shapeView = new ShapeView(this.app.screen.height * .2, shape);
                    shapeView.view.position.set((shapeView.view.width + shapeMargin) * bottomShapesContainer.children.length, 0);
                    smallShapeWidth = shapeView.view.width;
                    bottomShapesContainer.addChild(shapeView.view);
                    views.push(shapeView);
                });
            bottomShapesContainer.position.set(this.app.screen.width/2 - (bottomShapes.length-1) * (smallShapeWidth + shapeMargin) / 2, this.app.screen.height - shapeMargin + smallShapeWidth/2);
            bottomShapesContainer.pivot.set(0, bottomShapesContainer.height);
            this.app.stage.addChild(main.view, bottomShapesContainer);
            this.setState({views: views}, () => {
                this.timeout = setTimeout(() => this.updateScores(), 2000);
            });
        }
    }

    updateScores() {
        
        this.setState(prevState => {
            const prevScores = prevState.scores.slice();
            const scores = prevState.players.map(p => {
                const prevScore = prevScores.filter(s => s.id == p.id)[0];
                return { 
                    id: p.id, 
                    name: p.name, 
                    score: prevState.shape!.id == p.choice ? 1 : 0 + (prevScore ? prevScore.score : 0) };
                });
            
            return {
                showScores: true,
                scores: scores
            };
        });
    }

    componentDidMount() {
        super.componentDidMount();
        this.props.connection.on("gameUpdate", (id, name, choice) => {
            var user = {
                id: id,
                name: name,
                choice: choice
            };

            this.timeout && clearTimeout(this.timeout);

            this.setState(prevState => {
                const players = prevState.players.map((p: Player) => p);
                if (!players.filter((p:Player) => p.id === user.id).length) {
                    const view = this.state.views.filter(v => v.id == user.choice)[0];
                    if (view) { 
                        if (!players.filter(p => p.choice === user.choice).length) {
                            view.updateFirst(user.name);
                        }
                        view.increment();
                    }
                    
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
        const shapes = shuffle([
          { id: 0, color: Colors.Red.C500, type: ShapeType.Circle },
          { id: 1, color: Colors.Green.C500, type: ShapeType.Circle},
          { id: 2, color: Colors.Blue.C500, type: ShapeType.Circle},
          { id: 3, color: Colors.Indigo.C500, type: ShapeType.Circle},  
          { id: 4, color: Colors.Orange.C500, type: ShapeType.Circle},  
        ]).slice(1);

        this.setState({
            shapes: shapes,
            shape: shapes[0],
            showScores: false
        }, () => {
            this.adminMessage(shuffle(shapes));
            this.init();
        });
    }

    render() {
        if (this.state.showScores) {
            
            this.app.view.parentElement && this.app.view.parentElement.removeChild(this.app.view);
            const scores = this.state.scores
                .sort((a,b) => a.score - b.score)
                .map((p, ix) => <li key={ix}>{p.score} - {p.name}</li>); 

            return <div>
                <h1>Scores</h1>
                <ul>
                    {scores}
                </ul>
                <Button className="primary" onClick={() => this.setShape()}>Again</Button>
            </div>;
        } else {
            return super.render();
        }
    }
}
