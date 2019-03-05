import React from 'react';
import { Form, FormGroup, ControlLabel, FormControl } from "react-bootstrap";
import { PongColors as Colors } from './PongColors';
import * as PIXI from "pixi.js";
import ReactAnimationFrame from 'react-animation-frame';
import { BaseGame } from '../BaseGame'

const defaultSpeed = 200;
const defaultHeight = 3;
const defaultWidth = 30;

class Presenter extends BaseGame {
    displayName = Presenter.name

    constructor(props, context) {
        super(props, context);

        this.app = new PIXI.Application({ autoResize: true, backgroundColor: Colors.Background });

        this.pixiElement = null;

        this.state = {
            left: 0,
            right: 0,
            paddleWidth: defaultWidth,
            paddleHeight: defaultHeight,
            speed: defaultSpeed
        };
    }

    componentDidMount() {
        super.componentDidMount();
        this.props.connection.on("gameUpdate", (response) => {
            this.setState(response);
        });
    }

    clampPaddle(paddle) {
        if (paddle.y < paddle.width / 2 + paddle.height / 2)
            paddle.y = paddle.width / 2 + paddle.height / 2;
        else if (paddle.y > this.app.renderer.height - paddle.height / 2 - paddle.width / 2)
            paddle.y = this.app.renderer.height - paddle.height / 2 - paddle.width / 2;
    }

    onAnimationFrame(time, lastTime) {
        const delta = (time - lastTime) / 1000;
        this.leftPaddle.y -= this.state.speed * delta * this.state.left;
        this.rightPaddle.y -= this.state.speed * delta * this.state.right;

        this.clampPaddle(this.leftPaddle);
        this.clampPaddle(this.rightPaddle);
    }

    pixiUpdate = (element) => {
        this.pixiElement = element;

        if (this.pixiElement && this.pixiElement.children.length <= 0) {
            this.pixiElement.appendChild(this.app.view);
            this.app.renderer.resize(element.clientWidth, element.clientHeight);

            this.init(element);    
        }
    }

    init() {
        const element = this.pixiElement;
        const paddleWidth = element.clientWidth/(this.state.paddleWidth || defaultWidth);
        const paddleHeight = element.clientHeight/(this.state.paddleHeight || defaultHeight);

        if (this.leftPaddle)
            this.app.stage.removeChild(this.leftPaddle);

        if (this.rightPaddle)
            this.app.stage.removeChild(this.rightPaddle);

        if (this.ball)
            this.app.stage.removeChild(this.ball);

        this.leftPaddle = this.getBlock(Colors.LeftPaddleUp, paddleWidth, paddleHeight);
        this.rightPaddle = this.getBlock(Colors.RightPaddleUp, paddleWidth, paddleHeight);
        this.ball = this.getBlock(Colors.Ball, paddleWidth, paddleWidth);

        this.leftPaddle.position.set(paddleWidth, element.clientHeight/2);
        this.rightPaddle.position.set(element.clientWidth - paddleWidth, element.clientHeight/2);
        this.ball.position.set(element.clientWidth/2, element.clientHeight/2);

        this.app.stage.addChild(this.leftPaddle, this.rightPaddle, this.ball);
    }

    getBlock(color, width, height) {
        const g = new PIXI.Graphics();
        g.beginFill(color);
        g.drawRect(0, 0, width, height);
        g.pivot.set(width/2, height/2);
        return g;
    }

    updateHeight = (e) => {
        this.setState({paddleHeight: e.target.value}, this.init);
    }

    updateWidth = (e) => {
        this.setState({paddleWidth: e.target.value}, this.init);
    }

    updateSpeed = (e) => {
        this.setState({speed: e.target.value}, this.init);
    }
 
    render() {
        return (
            <div>
                <h2>Pong</h2>
                <div ref={this.pixiUpdate} />
                <Form inline>
                    <FormGroup controlId="formInlineName">
                        <ControlLabel>Width</ControlLabel>{' '}
                        <FormControl type="text" placeholder="Paddle width" value={this.state.paddleWidth} onChange={this.updateWidth} />
                    </FormGroup>{' '}
                    <FormGroup controlId="formInlineName">
                        <ControlLabel>Height</ControlLabel>{' '}
                        <FormControl type="text" placeholder="Paddle height" value={this.state.paddleHeight} onChange={this.updateHeight} />
                    </FormGroup>{' '}
                    <FormGroup controlId="formInlineName">
                        <ControlLabel>Speed</ControlLabel>{' '}
                        <FormControl type="text" placeholder="Speed" value={this.state.speed} onChange={this.updateSpeed} />
                    </FormGroup>{' '}
                    </Form>
            </div>
        );
    }
}

export default ReactAnimationFrame(Presenter);
