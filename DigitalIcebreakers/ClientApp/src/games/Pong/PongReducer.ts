import { combineReducers } from "redux";
import {
  createReceiveReducer,
  createReceiveGameMessageReducer,
  createGameActionWithPayload,
  createGameAction,
} from "../../store/actionHelpers";
import { PongColors as Colors } from "./PongColors";
import { clamp } from "../../util/clamp";

export const Name = "pong";

interface PongState {
  client: TeamColors;
  presenter: PongPresenterState;
}

export interface TeamColors {
  up: number;
  down: number;
}

export interface PongPresenterState {
  paddleHeight: number;
  paddleWidth: number;
  paddleSpeed: number;
  ballSpeed: number;
  score: number[];
  leftSpeed: number;
  rightSpeed: number;
  leftTeam: number;
  rightTeam: number;
}

export const rightScores = createGameAction(Name, "presenter", "right-scores");
export const leftScores = createGameAction(Name, "presenter", "left-scores");
export const resetScores = createGameAction(Name, "presenter", "reset-scores");
export const setPaddleHeight = createGameActionWithPayload<number>(
  Name,
  "presenter",
  "set-paddle-height"
);
export const setPaddleWidth = createGameActionWithPayload<number>(
  Name,
  "presenter",
  "set-paddle-width"
);
export const setPaddleSpeed = createGameActionWithPayload<number>(
  Name,
  "presenter",
  "set-paddle-speed"
);
export const setBallSpeed = createGameActionWithPayload<number>(
  Name,
  "presenter",
  "set-ball-speed"
);

type PaddleDyMessage = {
  command: "paddleDy";
  left: number;
  right: number;
};

type TeamsMessage = {
  command: "teams";
  left: number;
  right: number;
};

const adminReducer = createReceiveGameMessageReducer<
  PaddleDyMessage | TeamsMessage,
  PongPresenterState
>(
  Name,
  {
    leftSpeed: 0,
    rightSpeed: 0,
    leftTeam: 0,
    rightTeam: 0,
    paddleSpeed: 200,
    paddleHeight: 5,
    paddleWidth: 55,
    ballSpeed: 3,
    score: [0, 0],
  },
  (
    state,
    {
      payload: {
        payload: { command, left, right },
      },
    }
  ) => {
    switch (command) {
      case "paddleDy":
        return {
          ...state,
          leftSpeed: left,
          rightSpeed: right,
        };
      case "teams": {
        return {
          ...state,
          leftTeam: left,
          rightTeam: right,
        };
      }
    }
  },
  "presenter",
  (builder) => {
    builder.addCase(rightScores, (state) => ({
      ...state,
      score: [state.score[0], state.score[1] + 1],
    }));
    builder.addCase(leftScores, (state) => ({
      ...state,
      score: [state.score[0] + 1, state.score[1]],
    }));
    builder.addCase(resetScores, (state) => ({
      ...state,
      score: [0, 0],
    }));
    builder.addCase(setPaddleHeight, (state, { payload }) => ({
      ...state,
      paddleHeight: clamp(payload, 2, 20),
    }));
    builder.addCase(setPaddleWidth, (state, { payload }) => ({
      ...state,
      paddleWidth: payload,
    }));
    builder.addCase(setPaddleSpeed, (state, { payload }) => ({
      ...state,
      paddleSpeed: clamp(payload, 1, 100),
    }));
    builder.addCase(setBallSpeed, (state, { payload }) => ({
      ...state,
      ballSpeed: payload,
    }));
  }
);

const clientReducer = createReceiveReducer<TeamColors>(
  Name,
  { up: 0xffffff, down: 0xffffff },
  (_, { payload: response }) => {
    const result = response.split(":");
    if (result[0] === "team") {
      switch (result[1]) {
        case "0":
          return { up: Colors.LeftPaddleUp, down: Colors.LeftPaddleDown };
        case "1":
          return { up: Colors.RightPaddleUp, down: Colors.RightPaddleDown };
        default:
          console.log(`Unexpected response: ${response}`);
      }
    } else {
      console.log(`Unexpected response: ${response}`);
    }
  },
  "client"
);

export const pongReducer = combineReducers<PongState>({
  client: clientReducer,
  presenter: adminReducer,
});
