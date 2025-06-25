import { PongColors as Colors } from "./PongColors";
import * as PIXI from "pixi.js";
import ReactAnimationFrame from "./ReactAnimationFrame";
import { BaseGame, BaseGameProps } from "../BaseGame";
import { between } from "../../Random";
import { Pixi } from "../pixi/Pixi";
import { useAtom, useSetAtom } from "jotai";
import { 
  pongAtom, 
  rightScoresAtom, 
  leftScoresAtom 
} from "./pongAtoms";
import React from "react";
import { Typography, Box } from "@mui/material";

const defaultMaxBounceAngle = 45;

function getRadians(degrees: number) {
  return (degrees * Math.PI) / 180;
}

type PongPresenterProps = BaseGameProps & {
  paddleHeight: number;
  paddleWidth: number;
  paddleSpeed: number;
  ballSpeed: number;
  score: number[];
  leftSpeed: number;
  rightSpeed: number;
  leftTeam: number;
  rightTeam: number;
  rightScores: () => void;
  leftScores: () => void;
};

class PongPresenterCore extends BaseGame<PongPresenterProps, {}> {
  app!: PIXI.Application;
  ballDx = 0;
  ballDy = 0;
  leftPaddle!: PIXI.Graphics;
  rightPaddle!: PIXI.Graphics;
  ball!: PIXI.Graphics;

  constructor(props: PongPresenterProps) {
    super(props);
    this.ballDx = props.ballSpeed;
    this.state = {
      gameOver: false,
    };
  }

  componentDidMount() {
    window.addEventListener("resize", () =>
      setTimeout(() => this.resize(), 510)
    );
  }

  clampPaddle(paddle: PIXI.Graphics) {
    if (paddle.y < paddle.width / 2 + paddle.height / 2)
      paddle.y = paddle.width / 2 + paddle.height / 2;
    else if (
      paddle.y >
      this.app.screen.height - paddle.height / 2 - paddle.width / 2
    )
      paddle.y = this.app.screen.height - paddle.height / 2 - paddle.width / 2;
  }

  paddleHit(paddle: PIXI.Graphics, direction: number) {
    const relativeIntersect = paddle.y - this.ball.y;
    const normalizedRelativeIntersect = relativeIntersect / (paddle.height / 2);
    const bounceAngle =
      normalizedRelativeIntersect * defaultMaxBounceAngle + 180 * direction;

    this.ballDx = this.props.ballSpeed * Math.cos(getRadians(bounceAngle));
    this.ballDy = this.props.ballSpeed * Math.sin(getRadians(bounceAngle));

    if (direction === 0) this.ballDy *= -1;

    this.ball.x = paddle.x + this.ball.width * (direction === 0 ? 1 : -1); // immediately move ball off paddle - protects from double hit

    console.log(
      "hit",
      relativeIntersect,
      normalizedRelativeIntersect,
      bounceAngle,
      this.ballDx,
      this.ballDy
    );
  }

  checkHit() {
    if (this.ball.y > this.app.renderer.height - this.ball.height / 2) {
      this.ball.y = this.app.renderer.height - this.ball.height / 2;
      this.ballDy *= -1;
    } else if (this.ball.y < this.ball.height / 2) {
      this.ball.y = this.ball.height / 2;
      this.ballDy *= -1;
    }

    if (this.ball.x < this.leftPaddle.x + this.leftPaddle.width) {
      // we've reached the left bounds
      if (this.paddleIntersection(this.leftPaddle))
        this.paddleHit(this.leftPaddle, 0);
      else {
        this.props.rightScores();
        console.log("death to blue");
        this.resize();
      }
    } else if (this.ball.x > this.rightPaddle.x - this.rightPaddle.width) {
      // we've reached the right bounds
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
    return (
      this.ball.y > paddle.y - paddle.height / 2 - this.ball.height / 2 &&
      this.ball.y < paddle.y + paddle.height / 2 + this.ball.height / 2
    );
  }

  onAnimationFrame(time: number, lastTime: number) {
    const delta = (time - lastTime) / 1000;

    if (this.ball) {
      this.ball.y += this.ballDy;
      this.ball.x += this.ballDx;
    }

    if (this.leftPaddle && this.rightPaddle) {
      this.leftPaddle.y -=
        this.props.paddleSpeed * delta * this.props.leftSpeed;
      this.rightPaddle.y -=
        this.props.paddleSpeed * delta * this.props.rightSpeed;

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
    const paddleWidth = this.app.screen.width / this.props.paddleWidth;
    const paddleHeight = this.app.screen.height / this.props.paddleHeight;
    this.leftPaddle = this.getBlock(
      Colors.LeftPaddleUp,
      paddleWidth,
      paddleHeight,
      this.leftPaddle
    );
    this.rightPaddle = this.getBlock(
      Colors.RightPaddleUp,
      paddleWidth,
      paddleHeight,
      this.rightPaddle
    );
    return { paddleWidth, paddleHeight };
  }

  resize() {
    if (this.app) {
      const { paddleWidth } = this.setPaddleSizes();

      this.app.stage.removeChildren();
      this.ball = this.getBlock(Colors.Ball, paddleWidth, paddleWidth);

      this.leftPaddle.position.set(paddleWidth, this.app.screen.height / 2);
      this.rightPaddle.position.set(
        this.app.screen.width - paddleWidth,
        this.app.screen.height / 2
      );
      this.ball.position.set(
        this.app.screen.width / 2,
        this.app.screen.height / 2
      );

      this.app.stage.addChild<PIXI.Container>(
        this.leftPaddle,
        this.rightPaddle,
        this.ball
      );

      this.setSpeed();
    }
  }

  componentDidUpdate(prevProps: PongPresenterProps) {
    if (this.app) {
      this.setPaddleSizes();
      if (prevProps.ballSpeed !== this.props.ballSpeed) {
        this.ballDx =
          (this.ballDx / prevProps.ballSpeed) * this.props.ballSpeed;
        this.ballDy =
          (this.ballDy / prevProps.ballSpeed) * this.props.ballSpeed;
      }
    }
  }

  setSpeed() {
    const direction = between(1, 2) - 1 || -1;

    const angle =
      between(defaultMaxBounceAngle, defaultMaxBounceAngle * 3) * direction;

    this.ballDx = this.props.ballSpeed * Math.sin(getRadians(angle));
    this.ballDy = this.props.ballSpeed * Math.cos(getRadians(angle));
  }

  getBlock(
    color: number,
    width: number,
    height: number,
    g: PIXI.Graphics = new PIXI.Graphics()
  ) {
    g.clear();
    g.beginFill(color);
    g.drawRect(0, 0, width, height);
    g.pivot.set(width / 2, height / 2);
    return g;
  }

  render() {
    return (
      <Box sx={{ position: "relative", height: "100vh", width: "100%" }}>
        <Typography
          variant="h2"
          sx={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            color: "#" + Colors.Score.toString(16).padStart(6, "0"),
            fontSize: "6rem",
            fontWeight: "bold",
            zIndex: 10,
          }}
        >
          {this.props.score[0]}-{this.props.score[1]}
        </Typography>
        <div style={{ display: "none" }}>
          <span id="red-team" data-count={this.props.rightTeam}></span>
          <span id="blue-team" data-count={this.props.leftTeam}></span>
        </div>
        <Pixi
          backgroundColor={Colors.Background}
          onAppChange={(app) => this.init(app)}
        />
      </Box>
    );
  }
}

// Wrapper component that uses Jotai hooks
const PongPresenterWrapper = (props: BaseGameProps) => {
  const [state] = useAtom(pongAtom);
  const rightScores = useSetAtom(rightScoresAtom);
  const leftScores = useSetAtom(leftScoresAtom);
  
  const presenterState = state.presenter;
  
  return (
    <PongPresenterCore
      {...props}
      {...presenterState}
      rightScores={rightScores}
      leftScores={leftScores}
    />
  );
};

// Apply ReactAnimationFrame HOC to the wrapper
const PongPresenter = ReactAnimationFrame(PongPresenterWrapper);

export default PongPresenter;