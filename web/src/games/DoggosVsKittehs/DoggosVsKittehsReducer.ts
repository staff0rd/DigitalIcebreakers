import { createReceiveGameMessageReducer } from "../../store/actionHelpers";

export const Name = "doggos-vs-kittehs";

interface ServerState {
  doggos: number;
  kittehs: number;
  undecided: number;
}

interface DoggosVsKittehsState {
  yes: number;
  no: number;
  maybe: number;
}

export const doggosVsKittehsReducer = createReceiveGameMessageReducer<
  ServerState,
  DoggosVsKittehsState
>(
  Name,
  {
    yes: 0,
    no: 0,
    maybe: 0,
  },
  (_, { payload: { payload: result } }) => ({
    yes: result.doggos,
    no: result.kittehs,
    maybe: result.undecided,
  })
);
