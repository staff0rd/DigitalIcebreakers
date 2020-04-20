import { createReceiveGameMessageReducer } from '../../store/actionHelpers';
import { YesNoMaybeState } from '../YesNoMaybe/YesNoMaybeReducer';

export const Name = "doggos-vs-kittehs";

interface ServerState {
    doggos: number,
    kittehs: number,
    undecided: number,
}

export const doggosVsKittehsReducer = createReceiveGameMessageReducer<ServerState, YesNoMaybeState>(
    Name,
    {
        yes: 0,
        no: 0,
        maybe: 0,
    }, (_, { payload: { payload: result }  }) => ({
        yes: result.doggos,
        no: result.kittehs,
        maybe: result.undecided,
    })
);

