import { atom } from "jotai";
import { registerGame } from "../../store/jotai/gameMessageHandlers";

export interface Player {
  id: string;
  name: string;
  state: string;
}

export type BuzzerState = Player[];

export const buzzerAtom = atom<BuzzerState>([]);

const buzzerMessageHandler = (
        currentState: BuzzerState,
        message: any,
        isPresenter: boolean
      ): BuzzerState => {
        if (!isPresenter || !message.payload || !message.id || !message.name) {
          return currentState;
        }
      
        const { payload, id: playerId, name: playerName } = message;
        const existingPlayer = currentState.find(p => p.id === playerId);
        
        if (existingPlayer) {
          return currentState.map(p => 
            p.id === playerId ? { ...p, state: payload } : p
          );
        }
        
        return [...currentState, { id: playerId, name: playerName, state: payload }];
      };

registerGame("buzzer", buzzerAtom, buzzerMessageHandler);
