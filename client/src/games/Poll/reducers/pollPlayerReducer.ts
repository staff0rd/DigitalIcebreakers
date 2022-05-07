import { createReceiveReducer } from "@store/actionHelpers";
import { AvailableAnswers } from "@games/shared/Poll/types/AvailableAnswers";
import { PollPlayerState } from "@games/shared/Poll/types/PlayerState";
import { playerActionReducer } from "../../shared/Poll/reducers/playerActionReducer";
import { initialPlayerState } from "../../shared/Poll/reducers/initialPlayerState";
import { Name } from "..";

type Payload = AvailableAnswers;

export const pollPlayerReducer = createReceiveReducer<Payload, PollPlayerState>(
  Name,
  initialPlayerState,
  (state, { payload: availableAnswers }) => {
    return {
      ...state,
      ...availableAnswers,
      answerLocked: !!availableAnswers.selectedAnswerId,
    };
  },
  "client",
  playerActionReducer(Name)
);
