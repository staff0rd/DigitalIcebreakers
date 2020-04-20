import { createReceiveGameMessageReducer } from '../../store/actionHelpers';

export interface YesNoMaybeState {
    yes: number;
    no: number;
    maybe: number;
}

export const Name='yes-no-maybe';

export const yesNoMaybeReducer = createReceiveGameMessageReducer<YesNoMaybeState>(
    Name,
    {yes: 0, no: 0, maybe: 0},
    (_, action) => action.payload.payload);
