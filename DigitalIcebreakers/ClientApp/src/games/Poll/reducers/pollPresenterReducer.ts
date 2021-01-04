import { createReceiveGameMessageReducer } from "store/actionHelpers";
import { SelectedAnswer } from "games/shared/Poll/types/SelectedAnswer";
import { PollPresenterState } from "games/shared/Poll/types/PresenterState";
import { Name } from "..";
import { presenterActionReducers } from "games/shared/Poll/reducers/presenterActionReducers";
import { initialPresenterState } from "games/shared/Poll/reducers/initialPresenterState";
import { presenterPayloadReducer } from "games/shared/Poll/reducers/presenterPayloadReducer";
export const storageKey = "poll:questions";

export const pollPresenterReducer = createReceiveGameMessageReducer<
  SelectedAnswer[],
  PollPresenterState
>(
  Name,
  initialPresenterState(storageKey),
  (
    state: PollPresenterState,
    { payload: { id: playerId, name: playerName, payload: answers } }
  ) => presenterPayloadReducer(state, answers, playerId, playerName),
  "presenter",
  (builder) => presenterActionReducers(Name, storageKey)(builder, () => true)
);
