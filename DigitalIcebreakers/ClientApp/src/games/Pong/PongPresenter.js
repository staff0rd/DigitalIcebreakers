import React from 'react';
import { Form, FormGroup, ControlLabel, FormControl } from "react-bootstrap";
import { PongColors as Colors } from './PongColors';
import * as PIXI from "pixi.js";
import ReactAnimationFrame from 'react-animation-frame';
import { BaseGame } from '../BaseGame';
import * as gsap from "gsap";
import * as random from '../../Random';
import * as intersects from "intersects";

const defaultSpeed = 200;
const defaultHeight = 3;
const defaultWidth = 30;
const largestAngle = 60;

function getPointFromAngleDistance(x, y, angle, distance) {
    return { x: Math.cos(angle) * distance + x, y: Math.sin(angle) * distance + y };
}

function getRadians(degrees) {
    return degrees * Math.PI / 180;
}

function distance(p1, p2) {
    return Math.sqrt(distanceSquared(p1, p2))
}

function distanceSquared(p1, p2)
{
    return Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2);
}

function getRectangleIntersection(startX, startY, endX, endY, rect) {
    return getIntersection(startX, startY, endX, endY, rect.left, rect.top, rect.right, rect.top) ||
        getIntersection(startX, startY, endX, endY, rect.right, rect.top, rect.right, rect.bottom) ||
        getIntersection(startX, startY, endX, endY, rect.left, rect.bottom, rect.right, rect.bottom) ||
        getIntersection(startX, startY, endX, endY, rect.left, rect.top, rect.left, rect.bottom);
}

function getIntersection(line1StartX, line1StartY, line1EndX, line1EndY, 
                            line2StartX, line2StartY, line2EndX, line2EndY, determinePoint = true) {
        var result = { x: 0, y: 0 };

        var a1 = line1EndY - line1StartY;
        var a2 = line2EndY - line2StartY;
        var b1 = line1StartX - line1EndX;
        var b2 = line2StartX - line2EndX;
        var c1 = (line1EndX * line1StartY) - (line1StartX * line1EndY);
        var c2 = (line2EndX * line2StartY) - (line2StartX * line2EndY);
        var denom = (a1 * b2) - (a2 * b1);

        if (denom === 0)
        {
            return null;
        }

        result.x = ((b1 * c2) - (b2 * c1)) / denom;
        result.y = ((a2 * c1) - (a1 * c2)) / denom;

        if (determinePoint)
        {
            var uc = ((line2EndY - line2StartY) * (line1EndX - line1StartX) - (line2EndX - line2StartX) * (line1EndY - line1StartY));
            var ua = (((line2EndX - line2StartX) * (line1StartY - line2StartY)) - (line2EndY - line2StartY) * (line1StartX - line2StartX)) / uc;
            var ub = (((line1EndX - line1StartX) * (line1StartY - line2StartY)) - ((line1EndY - line1StartY) * (line1StartX - line2StartX))) / uc;

            if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1)
            {
                return result;
            }
            else
            {
                return null;
            }
        }
        return result;
    }

class Presenter extends BaseGame {
    displayName = Presenter.name

    constructor(props, context) {
        super(props, context);

        this.app = new PIXI.Application({ autoResize: true, backgroundColor: Colors.Background });

        this.pixiElement = null;

        this.ballBounds = null;

        this.state = {
            left: 0,
            right: 0,
            paddleWidth: defaultWidth,
            paddleHeight: defaultHeight,
            speed: defaultSpeed,
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

    onAnimationFrame(time, lastTime) {
        const delta = (time - lastTime) / 1000;

        if (!this.state.gameOver) {
            this.leftPaddle.y -= this.state.speed * delta * this.state.left;
            this.rightPaddle.y -= this.state.speed * delta * this.state.right;

            this.clampPaddle(this.leftPaddle);
            this.clampPaddle(this.rightPaddle);
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

        this.start();
    }

    start() {
        const sideMargin = this.leftPaddle.x + this.leftPaddle.width / 2 + this.ball.width / 2;

        this.ballBounds = new PIXI.Rectangle(sideMargin, this.ball.height / 2, this.app.renderer.width - 2*sideMargin, this.app.renderer.height - this.ball.height);

        const direction = (random.between(1, 2) - 1) * 180;

        const angle = random.between(0, largestAngle * 2) - largestAngle + direction;

        const outOfBoundsEnd = getPointFromAngleDistance(this.ball.x, this.ball.y, getRadians(angle), this.app.renderer.width + this.app.renderer.height);

        const intersection =  getRectangleIntersection(this.ball.x, this.ball.y, outOfBoundsEnd.x, outOfBoundsEnd.y, this.ballBounds);

        var g = new PIXI.Graphics();
        this.app.stage.addChild(g);
        
        g.lineStyle(2, 0xff0000);
        g.moveTo(this.ball.x, this.ball.y);
        g.lineTo(intersection.x, intersection.y);

        const time = distance({x: this.ball.x, y: this.ball.y}, {x: intersection.x, y: intersection.y}) / this.state.speed;
        console.log(time);
        gsap.TimelineMax.to(this.ball.position, time, {x: intersection.x, y: intersection.y, ease:gsap.Linear.easeNone, force3D:false});
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
