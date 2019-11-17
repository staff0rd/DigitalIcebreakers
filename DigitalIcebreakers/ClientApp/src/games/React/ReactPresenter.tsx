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
import * as gsap from "gsap";

interface Choice {
    id: string;
    choice: number;
}

interface Score {
    id: string;
    name: string;
    score: number;
}

interface ReactState {
    shapes: Shape[],
    shape: Shape|undefined,
    views: ShapeView[],
    showScores: boolean,
    scores: Score[],
    choices: Choice[],
    autoAgain: boolean
}

export class ReactPresenter extends PixiPresenter<BaseGameProps, ReactState> {
    private timeout: NodeJS.Timeout|undefined;
    private againProgressElement?: HTMLDivElement;
    private againTween?: GSAPStatic.Tween;
    constructor(props: BaseGameProps) {
        super(Colors.White, props);

        this.state = {
            shapes: [],
            shape: undefined,
            views: [],
            showScores: false,
            scores: [],
            choices: [],
            autoAgain: false
        };
    }

    againProgress = (element: HTMLDivElement) => {
        this.againProgressElement = element;
        if (element)
            this.triggerAgainProgress();
    }

    again() {
        this.setState(prevState => { return { autoAgain: !prevState.autoAgain}}, () => this.triggerAgainProgress() );
    }

    triggerAgainProgress() {
        if (this.state.autoAgain) {
            this.againTween = gsap.TweenLite.to(this.againProgressElement!.style,5, { width: '0px', ease: "power1.in", onComplete: () => this.setShape() } );
        } else
            this.againTween && this.againTween.kill();
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
            const totalChoices = prevState.choices.length;
            const correct = [...prevState.choices]
                .filter(p => p.choice === this.state.shape!.id)
                .map((choice, ix: number) => {
                    return { 
                        id:choice.id, 
                        name: super.getUserName(choice.id) || "", 
                        score: totalChoices-ix
                    }});
            const wrong = [...prevState.choices]
                .filter(p => p.choice !== this.state.shape!.id)
                .map(choice => {
                    return { 
                        id:choice.id, 
                        name: super.getUserName(choice.id) || "",
                        score: -1
                }});
            
            const newScores = [...prevState.scores];
                    
            [...correct, ...wrong].forEach(score => {
                const existing = newScores.filter(p => p.id === score.id)[0];
                if (existing)
                    existing.score += score.score;
                else if (score.name !== "")
                    newScores.push(score);
            });

            this.props.players.forEach(p => {
                if (!newScores.filter(s => s.id === p.id).length)
                newScores.push({id: p.id, name: p.name, score: 0})
            })

            return {
                showScores: true,
                scores: newScores,
                choices: []
            };
        });
    }

    componentDidMount() {
        super.componentDidMount();
        this.props.connection.on("gameUpdate", (id: string, choice: number) => {
            var user = {
                id: id,
                choice: choice
            };

            this.timeout && clearTimeout(this.timeout);

            this.setState(prevState => {
                const choices = [...prevState.choices];
                if (!choices.filter((p:Choice) => p.id === user.id).length) {
                    const view = this.state.views.filter(v => v.id === user.choice)[0];
                    if (view) { 
                        if (!choices.filter(p => p.choice === user.choice).length) {
                            view.updateFirst(super.getUserName(user.id) || "");
                        }
                        view.increment();
                    }
                    
                    choices.push(user);
                }
               
                return { choices: choices };
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
                .sort((a,b) => b.score - a.score)
                .map((p, ix) => <li key={ix}>{p.score} - {p.name}</li>); 

            return <div>
                <h1>Scores</h1>
                <ul>
                    {scores}
                </ul>
                <Button className="primary" onClick={() => this.again() }>Again</Button>
                <div ref={this.againProgress} style={{marginTop: 15, width: 200, height: 20, backgroundColor: Colors.toHtml(Colors.Red.C400)}}></div>
            </div>;
        } else {
            return super.render();
        }
    }
}
