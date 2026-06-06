import { atom } from 'jotai';
import { registerGame } from '../../store/jotai/gameMessageHandlers';

export interface SplatState {
  count: number;
}

export const splatAtom = atom<SplatState>({
  count: 0
});

const handleSplatMessage = (
  currentState: SplatState,
  message: any
): SplatState => {
  if (message?.payload === 'down') {
    return { count: currentState.count + 1 };
  }
  return currentState;
};

registerGame('splat', splatAtom, handleSplatMessage);