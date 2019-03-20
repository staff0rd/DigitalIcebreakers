import React from 'react';
import { Form, FormGroup, ControlLabel, FormControl } from "react-bootstrap";
import { PongColors as Colors } from './PongColors';
import * as PIXI from "pixi.js";
import ReactAnimationFrame from 'react-animation-frame';
import { BaseGame } from '../BaseGame'

const defaultPaddleSpeed = 200;
const defaultHeight = 3;
const defaultWidth = 30;
const defaultMaxBounceAngle = 45;
const defaultBallSpeed = 3;

function between(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRadians(degrees) {
    return degrees * Math.PI / 180;
}

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
            paddleSpeed: defaultPaddleSpeed,
            ballDx: defaultBallSpeed,
            ballDy: 0,
            ballSpeed: defaultBallSpeed,
            gameOver: false
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

    paddleHit(paddle, direction) {
        var relativeIntersect = paddle.y - this.ball.y;
        var normalizedRelativeIntersect = relativeIntersect / (paddle.height / 2);
        var bounceAngle = normalizedRelativeIntersect * defaultMaxBounceAngle + 180 * direction;
        
        this.state.ballDx = this.state.ballSpeed * Math.cos(getRadians(bounceAngle));
        this.state.ballDy = this.state.ballSpeed * Math.sin(getRadians(bounceAngle));

        if (direction === 0)
            this.state.ballDy *= -1;
        
        this.ball.x = paddle.x + this.ball.width * (direction === 0 ? 1 : -1); // immediately move ball off paddle - protects from double hit

        console.log('hit', relativeIntersect, normalizedRelativeIntersect, bounceAngle, this.state.ballDx, this.state.ballDy);
    }

    checkHit() {
        if (this.ball.y > this.app.renderer.height - this.ball.height / 2) {
            this.ball.y = this.app.renderer.height - this.ball.height / 2;
            this.state.ballDy *= -1;
        } else if (this.ball.y < this.ball.height / 2) {
            this.ball.y = this.ball.height / 2;
            this.state.ballDy *= -1;
        }

        if (this.ball.x < this.leftPaddle.x + this.leftPaddle.width) { // we've reached the left bounds
            if (this.paddleIntersection(this.leftPaddle))
                this.paddleHit(this.leftPaddle, 0);
            else {
                console.log("death to blue");
                this.init();
            }
        } else if (this.ball.x > this.rightPaddle.x - this.rightPaddle.width) { // we've reached the right bounds
            if (this.paddleIntersection(this.rightPaddle)) {
                this.paddleHit(this.rightPaddle, -1);
            } else {
                console.log("death to red");
                this.init();
            }
        }
    }

    paddleIntersection(paddle) {
        return this.ball.y > paddle.y - paddle.height / 2 - this.ball.height / 2 && this.ball.y < paddle.y + paddle.height / 2 + this.ball.height /2;
    }

    onAnimationFrame(time, lastTime) {
        const delta = (time - lastTime) / 1000;

        this.ball.y += this.state.ballDy;
        this.ball.x += this.state.ballDx;

        if (!this.state.gameOver) {
            this.leftPaddle.y -= this.state.paddleSpeed * delta * this.state.left;
            this.rightPaddle.y -= this.state.paddleSpeed * delta * this.state.right;

            this.clampPaddle(this.leftPaddle);
            this.clampPaddle(this.rightPaddle);

            this.checkHit();
        }
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

        this.setSpeed();
    }

    setSpeed() {
        const direction = between(1,2)-1 || -1;

        const angle = between(defaultMaxBounceAngle, defaultMaxBounceAngle * 3) * direction;

        this.state.ballDx = this.state.ballSpeed * Math.sin(getRadians(angle));
        this.state.ballDy = this.state.ballSpeed * Math.cos(getRadians(angle));

        const speed = Math.sqrt(Math.pow(this.state.ballDx, 2) + Math.pow(this.state.ballDy, 2));
        console.log(this.state.ballDx, this.state.ballDy, `This is a speed of ${speed}, angle: ${angle}`);
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

    updatePaddleSpeed = (e) => {
        this.setState({paddleSpeed: e.target.value}, this.init);
    }

    updateBallSpeed = (e) => {
        this.setState({ballSpeed: e.target.value}, this.init);
    }
 
    render() {
        return (
            <div>
                <h2>Pong</h2>
                <div ref={this.pixiUpdate} />
                <Form inline>
                    <FormGroup>
                        <ControlLabel>Width</ControlLabel>{' '}
                        <FormControl type="number" step="5" placeholder="Paddle width" value={this.state.paddleWidth} onChange={this.updateWidth} />
                    </FormGroup>{' '}
                    <FormGroup>
                        <ControlLabel>Height</ControlLabel>{' '}
                        <FormControl type="number" placeholder="Paddle height" value={this.state.paddleHeight} onChange={this.updateHeight} />
                    </FormGroup>{' '}
                    <FormGroup>
                        <ControlLabel>Paddle Speed</ControlLabel>{' '}
                        <FormControl type="number" step="10" placeholder="Paddle Speed" value={this.state.paddleSpeed} onChange={this.updatePaddleSpeed} />
                    </FormGroup>{' '}
                    <FormGroup>
                        <ControlLabel>Ball Speed</ControlLabel>{' '}
                        <FormControl type="number" placeholder="Ball Speed" value={this.state.ballSpeed} onChange={this.updateBallSpeed} />
                    </FormGroup>{' '}
                    </Form>
            </div>
        );
    }
}

export default ReactAnimationFrame(Presenter);
