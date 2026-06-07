import { atom } from 'jotai';
import { Shape } from './Shape';
import { Player } from 'Player';
import { registerGame } from '../../store/jotai/gameMessageHandlers';

// Types from the original reducer
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

interface ReactionPlayerState {
  shapes: Shape[];
  selectedId?: number;
}

export interface ReactionState {
  player: ReactionPlayerState;
  presenter: ReactionPresenterState;
}

// Initial state atoms
export const reactionAtom = atom<ReactionState>({
  player: {
    shapes: [],
  },
  presenter: {
    shapes: [],
    shape: undefined,
    showScores: false,
    scores: [],
    choices: [],
    autoAgain: false,
  },
});

// Action atoms for client
export const selectShapeAtom = atom(
  null,
  (get, set, shapeId: number) => {
    const state = get(reactionAtom);
    set(reactionAtom, {
      ...state,
      player: {
        ...state.player,
        selectedId: shapeId,
      },
    });
  }
);

// Action atoms for presenter
export const startRoundAtom = atom(
  null,
  (get, set, payload: { shapes: Shape[]; shape: Shape }) => {
    const state = get(reactionAtom);
    set(reactionAtom, {
      ...state,
      presenter: {
        ...state.presenter,
        shapes: payload.shapes,
        shape: payload.shape,
        showScores: false,
        choices: [],
      },
    });
  }
);

export const endRoundAtom = atom(
  null,
  (get, set, players: Player[]) => {
    const state = get(reactionAtom);
    const { presenter } = state;
    
    const getPlayerName = (playerId?: string) => {
      const player = players.find((p) => p.id === playerId);
      return player ? player.name : "";
    };

    const correct = [...presenter.choices]
      .filter((p) => p.choice === presenter.shape!.id)
      .map((choice) => {
        return {
          id: choice.id,
          name: getPlayerName(choice.id),
          score: +1 + (choice.isFirst ? 1 : 0),
        };
      });

    const wrong = [...presenter.choices]
      .filter((p) => p.choice !== presenter.shape!.id)
      .map((choice) => {
        return {
          id: choice.id,
          name: getPlayerName(choice.id),
          score: -1,
        };
      });

    const newScores = [...presenter.scores.map((s) => ({ ...s }))];

    [...correct, ...wrong].forEach((score) => {
      const existing = newScores.find((p) => p.id === score.id);
      if (existing) existing.score += score.score;
      else if (score.name !== "") newScores.push(score);
    });

    players.forEach((p) => {
      if (!newScores.filter((s) => s.id === p.id).length)
        newScores.push({ id: p.id, name: p.name, score: 0 });
    });

    set(reactionAtom, {
      ...state,
      presenter: {
        ...presenter,
        showScores: true,
        scores: newScores,
        shape: undefined,
        choices: [],
      },
    });
  }
);

export const toggleAutoAgainAtom = atom(
  null,
  (get, set) => {
    const state = get(reactionAtom);
    set(reactionAtom, {
      ...state,
      presenter: {
        ...state.presenter,
        autoAgain: !state.presenter.autoAgain,
      },
    });
  }
);

export const reactionMessageHandler = (
  currentState: ReactionState,
  message: any,
  isPresenter: boolean
): ReactionState => {
  if (isPresenter) {
    // Players send their chosen shape id; only their first choice counts, and
    // arrival order at the presenter decides who was first on each shape
    if (typeof message?.payload === 'number') {
      const newChoice = {
        id: message.id,
        choice: message.payload,
      } as Choice;

      const choices = [...currentState.presenter.choices];
      if (!choices.find((p: Choice) => p.id === newChoice.id)) {
        if (!choices.find((p) => p.choice === newChoice.choice))
          newChoice.isFirst = true;
        choices.push(newChoice);
      }

      return {
        ...currentState,
        presenter: {
          ...currentState.presenter,
          choices,
        },
      };
    }
  } else {
    // The presenter broadcasts the new round's shapes as an array
    if (Array.isArray(message)) {
      return {
        ...currentState,
        player: {
          ...currentState.player,
          shapes: message,
          selectedId: undefined,
        },
      };
    }
  }

  return currentState;
};

// Register the game with the message handler
registerGame('reaction', reactionAtom, reactionMessageHandler);