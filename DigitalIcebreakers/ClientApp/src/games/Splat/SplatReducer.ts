import { createReceiveGameMessageReducer } from '../../store/actionHelpers';

export const Name = "splat";

export interface SplatState {
    count: number,
}

export const splatReducer = createReceiveGameMessageReducer<string, SplatState>(
    Name,
    { count: 0 }, 
    (state, { payload: { payload: result }  }) => {
        return {
            count: state.count + (result === "down" ? 1 : 0)    
        }
    }
);

