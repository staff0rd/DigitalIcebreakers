import { WritableAtom } from "jotai";

export type GameMessageHandler<TState = unknown> = (
  currentState: TState,
  message: any,
  isPresenter: boolean
) => TState;

export type GameAtomWithHandler<TState = unknown> = {
  atom: WritableAtom<TState, [TState], void>;
  messageHandler: GameMessageHandler<TState>;
};

// Registry for game atoms and their message handlers
export const gameRegistry: Record<string, GameAtomWithHandler> = {};

// Register a game with its atom and message handler
export const registerGame = <TState>(
  gameName: string,
  atom: WritableAtom<TState, [TState], void>,
  messageHandler: GameMessageHandler<TState>
) => {
  gameRegistry[gameName] = { atom, messageHandler } as GameAtomWithHandler;
};

// Get game handler
export const getGameHandler = (gameName: string): GameAtomWithHandler | undefined => {
  return gameRegistry[gameName];
};

// Check if game is registered
export const isGameRegistered = (gameName: string): boolean => {
  return gameName in gameRegistry;
};