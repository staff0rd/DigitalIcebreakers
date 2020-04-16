import React, { Fragment } from 'react';
import { Navbar, Button } from 'react-bootstrap';
import { PongColors as Colors } from './PongColors';
import * as PIXI from "pixi.js";
import ReactAnimationFrame from 'react-animation-frame';
import { Stepper } from '../../components/Stepper';
import { clamp } from '../../util/clamp';
import { setGameUpdateCallback } from '../../store/connection/actions';
import { setMenuItems } from '../../store/shell/actions';
import { BaseGame, BaseGameProps } from '../BaseGame'
import { between } from '../../Random';
import { connect, ConnectedProps } from 'react-redux';

const connector = connect(
    null,
    { setGameUpdateCallback, setMenuItems }
);

type PropsFromRedux = ConnectedProps<typeof connector> & BaseGameProps;

const defaultPaddleSpeed = 200;
const defaultHeight = 5;
const defaultWidth = 55;
const defaultMaxBounceAngle = 45;
const defaultBallSpeed = 3;

function getRadians(degrees: number) {
    return degrees * Math.PI / 180;
}

type PongPresenterState = {
    left: number,
    right: number,
    paddleWidth: number,
    paddleHeight: number,
    paddleSpeed: number,
    ballSpeed: number,
    gameOver: boolean,
    score: number[]
}

class PongPresenter extends BaseGame<PropsFromRedux, PongPresenterState> {
    app!: PIXI.Application;
    score!: PIXI.Text;
    ballDx = defaultBallSpeed;
    ballDy = 0;
    leftPaddle!: PIXI.Graphics;
    rightPaddle!: PIXI.Graphics;
    ball!: PIXI.Graphics;

    constructor(props: PropsFromRedux) {
        super(props);

        this.state = {
            left: 0,
            right: 0,
            paddleWidth: defaultWidth,
            paddleHeight: defaultHeight,
            paddleSpeed: defaultPaddleSpeed,
            ballSpeed: defaultBallSpeed,
            gameOver: false,
            score: [0, 0]
        };
    }
    
    setMenuItems() {
        const header = (
            <Fragment>
                <Navbar.Form>
                    <Stepper label="Paddle height" step={1} value={this.state.paddleHeight} onChange={this.updatePaddleHeight} />
                    <Stepper label="Paddle width" step={-5} value={this.state.paddleWidth} onChange={this.updatePaddleWidth} />
                    <Stepper label="Paddle speed" step={25} value={this.state.paddleSpeed} onChange={this.updatePaddleSpeed} />
                    <Stepper label="Ball speed" step={1} value={this.state.ballSpeed} onChange={this.updateBallSpeed} />
                </Navbar.Form>
                <Navbar.Form>
                    <Button bsStyle="primary" onClick={this.resetScore}>Reset score</Button>
                </Navbar.Form>
            </Fragment>
        );
        this.props.setMenuItems([header]);
    }

    componentDidMount() {
        this.props.setGameUpdateCallback((response: any) => {
            this.setState(response);
        });
    }

    clampPaddle(paddle: PIXI.Graphics) {
        if (paddle.y < paddle.width / 2 + paddle.height / 2)
            paddle.y = paddle.width / 2 + paddle.height / 2;
        else if (paddle.y > this.app.screen.height - paddle.height / 2 - paddle.width / 2)
            paddle.y = this.app.screen.height - paddle.height / 2 - paddle.width / 2;
    }

    paddleHit(paddle: PIXI.Graphics, direction: number) {
        var relativeIntersect = paddle.y - this.ball.y;
        var normalizedRelativeIntersect = relativeIntersect / (paddle.height / 2);
        var bounceAngle = normalizedRelativeIntersect * defaultMaxBounceAngle + 180 * direction;
        
        this.ballDx = this.state.ballSpeed * Math.cos(getRadians(bounceAngle));
        this.ballDy = this.state.ballSpeed * Math.sin(getRadians(bounceAngle));

        if (direction === 0)
            this.ballDy *= -1;
        
        this.ball.x = paddle.x + this.ball.width * (direction === 0 ? 1 : -1); // immediately move ball off paddle - protects from double hit

        console.log('hit', relativeIntersect, normalizedRelativeIntersect, bounceAngle, this.ballDx, this.ballDy);
    }

    checkHit() {
        if (this.ball.y > this.app.renderer.height - this.ball.height / 2) {
            this.ball.y = this.app.renderer.height - this.ball.height / 2;
            this.ballDy *= -1;
        } else if (this.ball.y < this.ball.height / 2) {
            this.ball.y = this.ball.height / 2;
            this.ballDy *= -1;
        }

        if (this.ball.x < this.leftPaddle.x + this.leftPaddle.width) { // we've reached the left bounds
            if (this.paddleIntersection(this.leftPaddle))
                this.paddleHit(this.leftPaddle, 0);
            else {
                this.setState((prevState) => { score: [prevState.score[0], prevState.score[1]++]}, this.updateScore); // eslint-disable-line
                console.log("death to blue");
                this.init();
            }
        } else if (this.ball.x > this.rightPaddle.x - this.rightPaddle.width) { // we've reached the right bounds
            if (this.paddleIntersection(this.rightPaddle)) {
                this.paddleHit(this.rightPaddle, -1);
            } else {
                this.setState((prevState) => { score: [prevState.score[0]++, prevState.score[1]] }, this.updateScore); // eslint-disable-line
                console.log("death to red");
                this.init();
            }
        }
    }

    paddleIntersection(paddle: PIXI.Graphics) {
        return this.ball.y > paddle.y - paddle.height / 2 - this.ball.height / 2 && this.ball.y < paddle.y + paddle.height / 2 + this.ball.height /2;
    }

    onAnimationFrame(time: number, lastTime: number) {
        const delta = (time - lastTime) / 1000;

        this.ball.y += this.ballDy;
        this.ball.x += this.ballDx;

        if (!this.state.gameOver) {
            this.leftPaddle.y -= this.state.paddleSpeed * delta * this.state.left;
            this.rightPaddle.y -= this.state.paddleSpeed * delta * this.state.right;

            this.clampPaddle(this.leftPaddle);
            this.clampPaddle(this.rightPaddle);

            this.checkHit();
        }
    }

    init(app?: PIXI.Application) {
        if (app)
            this.app = app;
        
        const paddleWidth = this.app.screen.width/(this.state.paddleWidth || defaultWidth);
        const paddleHeight = this.app.screen.height/(this.state.paddleHeight || defaultHeight);

        this.app.stage.removeChildren();

        this.leftPaddle = this.getBlock(Colors.LeftPaddleUp, paddleWidth, paddleHeight);
        this.rightPaddle = this.getBlock(Colors.RightPaddleUp, paddleWidth, paddleHeight);
        this.ball = this.getBlock(Colors.Ball, paddleWidth, paddleWidth);

        this.leftPaddle.position.set(paddleWidth, this.app.screen.height/2);
        this.rightPaddle.position.set(this.app.screen.width - paddleWidth, this.app.screen.height/2);
        this.ball.position.set(this.app.screen.width/2, this.app.screen.height/2);

        this.score = new PIXI.Text("", { fontSize: this.app.renderer.width / 15, fill: Colors.Score});
        this.updateScore();

        this.app.stage.addChild<PIXI.Container>(this.score, this.leftPaddle, this.rightPaddle, this.ball);

        this.setSpeed();

        this.setMenuItems();
    }

    updateScore() {
        this.score.text = `${this.state.score[0]}-${this.state.score[1]}`;
        this.score.anchor.set(.5, 0);
        this.score.position.set(this.app.renderer.width / 2, 0);
    }

    setSpeed() {
        const direction = between(1,2)-1 || -1;

        const angle = between(defaultMaxBounceAngle, defaultMaxBounceAngle * 3) * direction;

        this.ballDx = this.state.ballSpeed * Math.sin(getRadians(angle));
        this.ballDy = this.state.ballSpeed * Math.cos(getRadians(angle));
    }

    getBlock(color: number, width: number, height: number) {
        const g = new PIXI.Graphics();
        g.beginFill(color);
        g.drawRect(0, 0, width, height);
        g.pivot.set(width/2, height/2);
        return g;
    }

    updatePaddleHeight = (value: number) => {
        this.setState({paddleHeight: clamp(value, 2, 20)}, this.init);
    }

    updatePaddleWidth = (value: number) => {
        this.setState({paddleWidth: value}, this.init);
    }

    updatePaddleSpeed = (value: number) => {
        this.setState({paddleSpeed: value}, this.init);
    }

    updateBallSpeed = (value: number)  => {
        this.setState({ballSpeed: value}, this.init);
    }

    resetScore = ()  => {
        this.setState({score: [0, 0]}, this.init);
    }
 }

export default connector(ReactAnimationFrame(PongPresenter));
