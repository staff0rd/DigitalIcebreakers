import { Player } from "Player";
import { combineReducers } from "redux";
import {
  createGameAction,
  createGameActionWithPayload,
  createReceiveGameMessageReducer,
  createReceiveReducer,
} from "@store/actionHelpers";
import { Name } from ".";
import { Shape } from "./Shape";

interface Choice {
  id: string;
  choice: number;
  isFirst?: boolean;
}

interface Score {
  id: string;
  name: string;
  score: number;
}

interface ReactionPresenterState {
  shapes: Shape[];
  shape: Shape | undefined;
  showScores: boolean;
  scores: Score[];
  choices: Choice[];
  autoAgain: boolean;
}

type Payload = {
  selectedId: number;
};

type StartRound = {
  shapes: Shape[];
  shape: Shape;
};

export const startRoundAction = createGameActionWithPayload<StartRound>(
  Name,
  "presenter",
  "start-round"
);

export const endRoundAction = createGameActionWithPayload<Player[]>(
  Name,
  "presenter",
  "end-round"
);

export const toggleAutoAgainAction = createGameAction(
  Name,
  "presenter",
  "toggle-auto-again"
);

export const getPlayerName = (players: Player[], id?: string) => {
  const player = players.find((p) => p.id === id);
  return player ? player.name : "";
};

const reactionPresenterReducer = createReceiveGameMessageReducer<
  Payload,
  ReactionPresenterState
>(
  Name,
  {
    shapes: [],
    shape: undefined,
    showScores: false,
    scores: [],
    choices: [],
    autoAgain: false,
  },
  (state, action) => {
    const newChoice = {
      id: action.payload.id,
      choice: action.payload.payload.selectedId,
    } as Choice;
    const choices = [...state.choices];
    if (!choices.find((p: Choice) => p.id === newChoice.id)) {
      if (!choices.find((p) => p.choice === newChoice.choice))
        newChoice.isFirst = true;
      choices.push(newChoice);
    }
    return {
      ...state,
      choices,
    };
  },
  "presenter",
  (builder) => {
    builder.addCase(endRoundAction, (state, action) => {
      const correct = [...state.choices]
        .filter((p) => p.choice === state.shape!.id)
        .map((choice, ix: number) => {
          return {
            id: choice.id,
            name: getPlayerName(action.payload, choice.id),
            score: +1 + (choice.isFirst ? 1 : 0),
          };
        });
      const wrong = [...state.choices]
        .filter((p) => p.choice !== state.shape!.id)
        .map((choice) => {
          return {
            id: choice.id,
            name: getPlayerName(action.payload, choice.id),
            score: -1,
          };
        });

      const newScores = [...state.scores.map((s) => ({ ...s }))];

      [...correct, ...wrong].forEach((score) => {
        const existing = newScores.find((p) => p.id === score.id);
        if (existing) existing.score += score.score;
        else if (score.name !== "") newScores.push(score);
      });

      action.payload.forEach((p) => {
        if (!newScores.filter((s) => s.id === p.id).length)
          newScores.push({ id: p.id, name: p.name, score: 0 });
      });

      return {
        ...state,
        showScores: true,
        scores: newScores,
        shape: undefined,
        choices: [],
      };
    });
    builder.addCase(startRoundAction, (state, action) => ({
      ...state,
      shapes: action.payload.shapes,
      shape: action.payload.shape,
      showScores: false,
    }));
    builder.addCase(toggleAutoAgainAction, (state) => {
      return {
        ...state,
        autoAgain: !!!state.autoAgain,
      };
    });
  }
);

export const selectShape = createGameActionWithPayload<number>(
  Name,
  "client",
  "select-shape"
);

type ReactionPlayerState = {
  shapes: Shape[];
  selectedId?: number;
};

const reactionPlayerReducer = createReceiveReducer<
  ReactionPlayerState,
  ReactionPlayerState
>(
  Name,
  { shapes: [] },
  (_, action) => action.payload,
  "client",
  (builder) => {
    builder.addCase(selectShape, (state, action) => ({
      ...state,
      selectedId: action.payload,
    }));
  }
);

export type ReactionState = {
  player: ReactionPlayerState;
  presenter: ReactionPresenterState;
};

export const reactionReducer = combineReducers<ReactionState>({
  player: reactionPlayerReducer,
  presenter: reactionPresenterReducer,
});
