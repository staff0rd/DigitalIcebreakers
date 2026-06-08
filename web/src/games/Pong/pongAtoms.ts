import { atom } from "jotai";
import { registerGame } from "../../store/jotai/gameMessageHandlers";
import { presenterMessageAtom } from "../../store/jotai/transportAtoms";
import { userAtom } from "../../store/atoms/userAtoms";
import { PongColors as Colors } from "./PongColors";
import { clamp } from "../../util/clamp";
import { Player } from "../../Player";

// playerId -> held paddle direction (1 up, -1 down, 0 released)
export type TeamDirections = Record<string, number>;

// playerId -> team index (0 left/blue, 1 right/red)
export type TeamAssignments = Record<string, number>;

export interface PongClientState {
  assignments: TeamAssignments;
}

export interface PongPresenterState {
  paddleHeight: number;
  paddleWidth: number;
  paddleSpeed: number;
  ballSpeed: number;
  score: number[];
  leftTeam: TeamDirections;
  rightTeam: TeamDirections;
}

export interface PongState {
  client: PongClientState;
  presenter: PongPresenterState;
}

export const pongAtom = atom<PongState>({
  client: {
    assignments: {},
  },
  presenter: {
    leftTeam: {},
    rightTeam: {},
    paddleSpeed: 200,
    paddleHeight: 5,
    paddleWidth: 55,
    ballSpeed: 3,
    score: [0, 0],
  },
});

const directionByAction: Record<string, number> = {
  up: 1,
  down: -1,
  release: 0,
};

registerGame(
  "pong",
  pongAtom,
  (currentState: PongState, message: any, isPresenter: boolean) => {
    if (isPresenter) {
      const direction = directionByAction[message?.payload];
      if (direction === undefined || !message?.id) {
        return currentState;
      }
      const { leftTeam, rightTeam } = currentState.presenter;
      if (message.id in leftTeam) {
        return {
          ...currentState,
          presenter: {
            ...currentState.presenter,
            leftTeam: { ...leftTeam, [message.id]: direction },
          },
        };
      }
      if (message.id in rightTeam) {
        return {
          ...currentState,
          presenter: {
            ...currentState.presenter,
            rightTeam: { ...rightTeam, [message.id]: direction },
          },
        };
      }
      return currentState;
    }

    if (message?.assignments) {
      return {
        ...currentState,
        client: { assignments: message.assignments },
      };
    }

    return currentState;
  }
);

const average = (team: TeamDirections) => {
  const directions = Object.values(team);
  if (!directions.length) return 0;
  return directions.reduce((sum, direction) => sum + direction, 0) /
    directions.length;
};

export const pongTeamsAtom = atom((get) => {
  const { leftTeam, rightTeam } = get(pongAtom).presenter;
  return {
    leftSpeed: average(leftTeam),
    rightSpeed: average(rightTeam),
    leftCount: Object.keys(leftTeam).length,
    rightCount: Object.keys(rightTeam).length,
  };
});

export const pongTeamViewAtom = atom((get) => {
  const team = get(pongAtom).client.assignments[get(userAtom).id];
  if (team === 0) {
    return {
      team: "blue",
      releasedColor: Colors.LeftPaddleUp,
      pressedColor: Colors.LeftPaddleDown,
    };
  }
  if (team === 1) {
    return {
      team: "red",
      releasedColor: Colors.RightPaddleUp,
      pressedColor: Colors.RightPaddleDown,
    };
  }
  return { team: "", releasedColor: 0xffffff, pressedColor: 0xffffff };
});

const toAssignments = (
  leftTeam: TeamDirections,
  rightTeam: TeamDirections
): TeamAssignments => ({
  ...Object.fromEntries(Object.keys(leftTeam).map((id) => [id, 0])),
  ...Object.fromEntries(Object.keys(rightTeam).map((id) => [id, 1])),
});

// The presenter is the team authority: it balances joining players across the
// teams, drops players who leave, and never lets one team sit empty while the
// other can spare a player. Whenever membership changes, the full assignment
// map is broadcast so clients (including late joiners via replay) learn their
// team.
export const syncTeamsAtom = atom(null, (get, set, players: Player[]) => {
  const state = get(pongAtom);
  const leftTeam = { ...state.presenter.leftTeam };
  const rightTeam = { ...state.presenter.rightTeam };
  const playerIds = new Set(players.map((p) => p.id));

  [leftTeam, rightTeam].forEach((team) =>
    Object.keys(team).forEach((id) => {
      if (!playerIds.has(id)) delete team[id];
    })
  );

  players.forEach((p) => {
    if (p.id in leftTeam || p.id in rightTeam) return;
    if (Object.keys(leftTeam).length <= Object.keys(rightTeam).length) {
      leftTeam[p.id] = 0;
    } else {
      rightTeam[p.id] = 0;
    }
  });

  const rebalance = (from: TeamDirections, to: TeamDirections) => {
    if (Object.keys(to).length === 0 && Object.keys(from).length > 1) {
      const [moved] = Object.keys(from);
      delete from[moved];
      to[moved] = 0;
    }
  };
  rebalance(leftTeam, rightTeam);
  rebalance(rightTeam, leftTeam);

  const assignments = toAssignments(leftTeam, rightTeam);
  const previous = toAssignments(
    state.presenter.leftTeam,
    state.presenter.rightTeam
  );
  const unchanged =
    Object.keys(assignments).length === Object.keys(previous).length &&
    Object.entries(assignments).every(([id, team]) => previous[id] === team);
  if (unchanged) return;

  set(pongAtom, {
    ...state,
    presenter: { ...state.presenter, leftTeam, rightTeam },
  });
  set(presenterMessageAtom, { assignments });
});

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
