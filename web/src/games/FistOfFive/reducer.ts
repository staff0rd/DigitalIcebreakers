import { combineReducers } from "redux";
import { sharedTriviaPlayerReducer } from "games/shared/Poll/reducers/sharedTriviaPlayerReducer";
import { FistOfFiveState } from "games/shared/Poll/types/State";
import { SelectedAnswer } from "games/shared/Poll/types/SelectedAnswer";
import { createReceiveGameMessageReducer } from "store/actionHelpers";
import { FistOfFivePresenterState } from "games/shared/Poll/types/PresenterState";
import { presenterActions } from "games/shared/Poll/reducers/presenterActions";
import { presenterPayloadReducer } from "games/shared/Poll/reducers/presenterPayloadReducer";

export const Name = "fist-of-five";

const { importQuestionsAction, toggleShowResponsesAction } = presenterActions(
  Name
);

export const pollPresenterReducer = createReceiveGameMessageReducer<
  SelectedAnswer[],
  FistOfFivePresenterState
>(
  Name,
  {
    questions: [],
    showResponses: false,
    currentQuestionId: "1",
  },
  (state, { payload: { id: playerId, name: playerName, payload: answers } }) =>
    presenterPayloadReducer(state, answers, playerId, playerName),
  "presenter",
  (builder) => {
    builder.addCase(importQuestionsAction, (state, { payload: questions }) => {
      let currentQuestionId: string | undefined;
      if (questions.length) {
        currentQuestionId = questions[0].id;
      }
      return {
        ...state,
        showResponses: false,
        questions,
        currentQuestionId,
      };
    });

    builder.addCase(toggleShowResponsesAction, (state) => ({
      ...state,
      showResponses: !state.showResponses,
    }));
  }
);

export const fistOfFiveReducer = combineReducers<FistOfFiveState>({
  player: sharedTriviaPlayerReducer(Name),
  presenter: pollPresenterReducer,
});
