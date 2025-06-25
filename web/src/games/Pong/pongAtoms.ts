import { atom } from "jotai";
import { registerGame } from "../../store/jotai/gameMessageHandlers";
import { PongColors as Colors } from "./PongColors";
import { clamp } from "../../util/clamp";

export interface PongClientState {
  releasedColor: number;
  pressedColor: number;
  team: string;
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

export interface PongState {
  client: PongClientState;
  presenter: PongPresenterState;
}

export const pongAtom = atom<PongState>({
  client: {
    releasedColor: 0xffffff,
    pressedColor: 0xffffff,
    team: "",
  },
  presenter: {
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
});

// Register message handler
registerGame(
  "pong",
  pongAtom,
  (currentState: PongState, message: any, isPresenter: boolean) => {
    if (isPresenter) {
      // Handle presenter messages
      // Messages may come wrapped in a GameMessage structure
      const payload = message.payload || message;
      
      if (payload.command === "paddleDy") {
        return {
          ...currentState,
          presenter: {
            ...currentState.presenter,
            leftSpeed: payload.left,
            rightSpeed: payload.right,
          },
        };
      } else if (payload.command === "teams") {
        return {
          ...currentState,
          presenter: {
            ...currentState.presenter,
            leftTeam: payload.left,
            rightTeam: payload.right,
          },
        };
      }
    } else {
      // Handle client messages
      if (typeof message === "string") {
        const result = message.split(":");
        if (result[0] === "team") {
          switch (result[1]) {
            case "0":
              return {
                ...currentState,
                client: {
                  releasedColor: Colors.LeftPaddleUp,
                  pressedColor: Colors.LeftPaddleDown,
                  team: "blue",
                },
              };
            case "1":
              return {
                ...currentState,
                client: {
                  releasedColor: Colors.RightPaddleUp,
                  pressedColor: Colors.RightPaddleDown,
                  team: "red",
                },
              };
          }
        }
      }
    }
    
    return currentState;
  }
);

// Action atoms for presenter actions
export const rightScoresAtom = atom(null, (get, set) => {
  const state = get(pongAtom);
  set(pongAtom, {
    ...state,
    presenter: {
      ...state.presenter,
      score: [state.presenter.score[0], state.presenter.score[1] + 1],
    },
  });
});

export const leftScoresAtom = atom(null, (get, set) => {
  const state = get(pongAtom);
  set(pongAtom, {
    ...state,
    presenter: {
      ...state.presenter,
      score: [state.presenter.score[0] + 1, state.presenter.score[1]],
    },
  });
});

export const resetScoresAtom = atom(null, (get, set) => {
  const state = get(pongAtom);
  set(pongAtom, {
    ...state,
    presenter: {
      ...state.presenter,
      score: [0, 0],
    },
  });
});

export const setPaddleHeightAtom = atom(null, (get, set, height: number) => {
  const state = get(pongAtom);
  set(pongAtom, {
    ...state,
    presenter: {
      ...state.presenter,
      paddleHeight: clamp(height, 2, 20),
    },
  });
});

export const setPaddleWidthAtom = atom(null, (get, set, width: number) => {
  const state = get(pongAtom);
  set(pongAtom, {
    ...state,
    presenter: {
      ...state.presenter,
      paddleWidth: width,
    },
  });
});

export const setPaddleSpeedAtom = atom(null, (get, set, speed: number) => {
  const state = get(pongAtom);
  set(pongAtom, {
    ...state,
    presenter: {
      ...state.presenter,
      paddleSpeed: clamp(speed, 1, 100),
    },
  });
});

export const setBallSpeedAtom = atom(null, (get, set, speed: number) => {
  const state = get(pongAtom);
  set(pongAtom, {
    ...state,
    presenter: {
      ...state.presenter,
      ballSpeed: speed,
    },
  });
});