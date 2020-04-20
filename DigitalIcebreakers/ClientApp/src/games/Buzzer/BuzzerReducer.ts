import { createReceiveGameMessageReducer } from '../../store/actionHelpers';

export interface Player {
    id: string;
    name: string;
    state: string;
}

export const Name = "buzzer";

export const buzzerReducer = createReceiveGameMessageReducer<string, Player[]>(
    Name,
    [], 
    (state, { payload  }) => [
        ...state.filter(p => p.id != payload.id),
        { id: payload.id, name: payload.name, state: payload.payload}
    ]
);

