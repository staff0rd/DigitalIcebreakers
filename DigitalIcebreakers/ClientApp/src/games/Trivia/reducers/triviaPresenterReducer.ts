import {
  createGameAction,
  createReceiveGameMessageReducer,
} from "@store/actionHelpers";
import { Question } from "@games/shared/Poll/types/Question";
import { SelectedAnswer } from "@games/shared/Poll/types/SelectedAnswer";
import {
  PresenterState,
  TriviaPresenterState,
} from "@games/shared/Poll/types/PresenterState";
import { Player } from "Player";
import {
  presenterActionReducers,
  ShouldShowResponses,
} from "@games/shared/Poll/reducers/presenterActionReducers";
import { initialPresenterState } from "@games/shared/Poll/reducers/initialPresenterState";
import { presenterPayloadReducer } from "@games/shared/Poll/reducers/presenterPayloadReducer";
import { Name } from "..";

export const storageKey = "trivia:questions";

type UserScore = {
  name: string;
  id: string;
  score: number;
};

export const sort = (userScores: UserScore[]) => {
  return userScores.sort((n1, n2) => {
    if (n1.score < n2.score) {
      return 1;
    }

    if (n1.score > n2.score) {
      return -1;
    }

    return 0;
  });
};

export const getPlayersWithNoScore = (players: Player[], scores: UserScore[]) =>
  players
    .filter((user) => !scores.find((score) => score.id === user.id))
    .map((user) => ({ name: user.name, score: 0, id: user.id }));

export const toggleShowScoreBoardAction = createGameAction(
  Name,
  "presenter",
  "toggle-show-scoreboard"
);

const shouldShowTriviaResponses = <S extends PresenterState>(
  state: S,
  newQuestion: Question | undefined
) => {
  let showResponses = state.showResponses;
  if (newQuestion && newQuestion.answers.filter((a) => a.correct).length)
    showResponses = false;
  return showResponses;
};

export const triviaPresenterReducer = createReceiveGameMessageReducer<
  SelectedAnswer[],
  TriviaPresenterState
>(
  Name,
  { ...initialPresenterState(storageKey), showScoreBoard: false },
  (state, { payload: { id: playerId, name: playerName, payload: answers } }) =>
    presenterPayloadReducer(state, answers, playerId, playerName),
  "presenter",
  (builder) => {
    presenterActionReducers(Name, storageKey)(
      builder,
      shouldShowTriviaResponses as ShouldShowResponses
    );
    builder.addCase(toggleShowScoreBoardAction, (state) => ({
      ...state,
      showScoreBoard: !state.showScoreBoard,
    }));
  }
);
