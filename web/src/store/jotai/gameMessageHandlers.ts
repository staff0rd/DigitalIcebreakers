import { WritableAtom } from "jotai";

export type GameMessageHandler<TState = unknown> = (
  currentState: TState,
  message: any,
  isPresenter: boolean
) => TState;

export type GameRegistrationOptions<TState = unknown> = {
  // Applied when a new game starts, so stale state from a previous round of
  // the same game does not leak into the fresh one
  resetState?: (current: TState) => TState;
};

export type GameAtomWithHandler<TState = unknown> = {
  atom: WritableAtom<TState, [TState], void>;
  messageHandler: GameMessageHandler<TState>;
  resetState?: (current: TState) => TState;
};

// Registry for game atoms and their message handlers
export const gameRegistry: Record<string, GameAtomWithHandler> = {};

// Register a game with its atom and message handler
export const registerGame = <TState>(
  gameName: string,
  atom: WritableAtom<TState, [TState], void>,
  messageHandler: GameMessageHandler<TState>,
  options: GameRegistrationOptions<TState> = {}
) => {
  gameRegistry[gameName] = {
    atom,
    messageHandler,
    resetState: options.resetState,
  } as GameAtomWithHandler;
};

// Get game handler
export const getGameHandler = (gameName: string): GameAtomWithHandler | undefined => {
  return gameRegistry[gameName];
};

// Check if game is registered
export const isGameRegistered = (gameName: string): boolean => {
  return gameName in gameRegistry;
};