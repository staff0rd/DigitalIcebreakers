import { createReducer } from '@reduxjs/toolkit';
import { createGameMessageReceivedAction } from '../../store/actionHelpers';

export interface YesNoMaybeState {
    yes: number;
    no: number;
    maybe: number;
}

export const Name='yes-no-maybe';

const receiveGameMessage = createGameMessageReceivedAction<YesNoMaybeState>(Name, "presenter", "receive-game-message");

export const yesNoMaybeReducer = createReducer<YesNoMaybeState>({yes: 0, no: 0, maybe: 0}, builder => {
    builder.addCase(receiveGameMessage, (state, action) => action.payload.payload);
});
