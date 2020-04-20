import React from 'react';
import { PongColors as Colors } from './PongColors';
import * as PIXI from "pixi.js";
import ReactAnimationFrame from 'react-animation-frame';
import { BaseGame, BaseGameProps } from '../BaseGame'
import { between } from '../../Random';
import { connect, ConnectedProps } from 'react-redux';
import { Pixi } from '../pixi/Pixi';
import { RootState } from '../../store/RootState';
import { rightScores, leftScores } from './PongReducer';

const connector = connect(
    (state: RootState) => state.games.pong.presenter,
    {
        rightScores,
        leftScores,
    }
);

type PropsFromRedux = ConnectedProps<typeof connector> & BaseGameProps;

const defaultMaxBounceAngle = 45;

function getRadians(degrees: number) {
    return degrees * Math.PI / 180;
}

class PongPresenter extends BaseGame<PropsFromRedux, {}> {
    app!: PIXI.Application;
    score!: PIXI.Text;
    ballDx = 0;
    ballDy = 0;
    leftPaddle!: PIXI.Graphics;
    rightPaddle!: PIXI.Graphics;
    ball!: PIXI.Graphics;

    constructor(props: PropsFromRedux) {
        super(props);
        this.ballDx = props.ballSpeed;
        this.state = {
            gameOver: false,
        };
    }

    componentDidMount() {
        window.addEventListener("resize", () => setTimeout(() => this.resize(), 510));
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
        
        this.ballDx = this.props.ballSpeed * Math.cos(getRadians(bounceAngle));
        this.ballDy = this.props.ballSpeed * Math.sin(getRadians(bounceAngle));

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
                this.props.rightScores();
                console.log("death to blue");
                this.resize();
            }
        } else if (this.ball.x > this.rightPaddle.x - this.rightPaddle.width) { // we've reached the right bounds
            if (this.paddleIntersection(this.rightPaddle)) {
                this.paddleHit(this.rightPaddle, -1);
            } else {
                this.props.leftScores();
                console.log("death to red");
                this.resize();
            }
        }
    }

    paddleIntersection(paddle: PIXI.Graphics) {
        return this.ball.y > paddle.y - paddle.height / 2 - this.ball.height / 2 && this.ball.y < paddle.y + paddle.height / 2 + this.ball.height /2;
    }

    onAnimationFrame(time: number, lastTime: number) {
        const delta = (time - lastTime) / 1000;

        if (this.ball) {
            this.ball.y += this.ballDy;
            this.ball.x += this.ballDx;
        }
        
        if (this.leftPaddle && this.rightPaddle) {
            this.leftPaddle.y -= this.props.paddleSpeed * delta * this.props.left;
            this.rightPaddle.y -= this.props.paddleSpeed * delta * this.props.right;

            this.clampPaddle(this.leftPaddle);
            this.clampPaddle(this.rightPaddle);

            this.checkHit();
        }
        
    }

    init(app: PIXI.Application) {
        if (app) {
            this.app = app;
            this.resize();
        }
    }

    setPaddleSizes() {
        const paddleWidth = this.app.screen.width/(this.props.paddleWidth);
        const paddleHeight = this.app.screen.height/(this.props.paddleHeight);
        this.leftPaddle = this.getBlock(Colors.LeftPaddleUp, paddleWidth, paddleHeight, this.leftPaddle);
        this.rightPaddle = this.getBlock(Colors.RightPaddleUp, paddleWidth, paddleHeight, this.rightPaddle);
        return {paddleWidth, paddleHeight};
    }

    resize() {
        if (this.app) {
            const { paddleWidth } = this.setPaddleSizes();

            this.app.stage.removeChildren();
            this.ball = this.getBlock(Colors.Ball, paddleWidth, paddleWidth);

            this.leftPaddle.position.set(paddleWidth, this.app.screen.height/2);
            this.rightPaddle.position.set(this.app.screen.width - paddleWidth, this.app.screen.height/2);
            this.ball.position.set(this.app.screen.width/2, this.app.screen.height/2);

            this.score = new PIXI.Text(this.getScore(), { fontSize: this.app.renderer.width / 15, fill: Colors.Score});
            this.score.anchor.set(.5, 0);
            this.score.position.set(this.app.screen.width / 2, 0);

            this.app.stage.addChild<PIXI.Container>(this.score, this.leftPaddle, this.rightPaddle, this.ball);

            this.setSpeed();
        }
    }

    getScore() {
        return `${this.props.score[0]}-${this.props.score[1]}`;
    }

    componentDidUpdate(prevProps: PropsFromRedux) {
        if (this.app) {
            this.score.text = this.getScore();
            this.setPaddleSizes(); 
            if (prevProps.ballSpeed != this.props.ballSpeed) {
                this.ballDx = this.ballDx / prevProps.ballSpeed * this.props.ballSpeed;
                this.ballDy = this.ballDy / prevProps.ballSpeed * this.props.ballSpeed;
            }
        }
    }

    setSpeed() {
        const direction = between(1,2)-1 || -1;

        const angle = between(defaultMaxBounceAngle, defaultMaxBounceAngle * 3) * direction;

        this.ballDx = this.props.ballSpeed * Math.sin(getRadians(angle));
        this.ballDy = this.props.ballSpeed * Math.cos(getRadians(angle));
    }

    getBlock(color: number, width: number, height: number, g: PIXI.Graphics = new PIXI.Graphics()) {
        g.clear();
        g.beginFill(color);
        g.drawRect(0, 0, width, height);
        g.pivot.set(width/2, height/2);
        return g;
    }

    render() {
        return <Pixi backgroundColor={Colors.Background} onAppChange={(app) => this.init(app)} />
    }
 }

export default connector(ReactAnimationFrame(PongPresenter));
