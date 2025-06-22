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
  message: any,
  isPresenter: boolean
): SplatState => {
  if (typeof message === 'object' && message !== null && 'count' in message) {
    return { count: message.count };
  }
  return currentState;
};

registerGame('splat', splatAtom, handleSplatMessage);