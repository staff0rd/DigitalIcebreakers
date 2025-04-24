import { Response } from "../../shared/Poll/types/Response";
import { RootState } from "../../../store/RootState";
import { createSelector } from "@reduxjs/toolkit";
import { sort, getPlayersWithNoScore } from "./triviaPresenterReducer";

export const scoreBoardSelector = createSelector(
  (state: RootState) => ({
    questions: state.games.trivia.presenter.questions,
    users: state.lobby.players,
  }),
  (state) => {
    const correctResponsesAsIds = state.questions.map((q) => {
      const correctAnswer = q.answers.find((a) => a.correct);
      const correctResponses = q.responses.filter(
        (r) => r.answerId === correctAnswer?.id
      );
      return correctResponses;
    });

    /// https://schneidenbach.gitbooks.io/typescript-cookbook/content/functional-programming/flattening-array-of-arrays.html
    const flattened = ([] as Response[]).concat(...correctResponsesAsIds);

    const ids = flattened.map((p) => p.playerId);
    const onlyUnique = <T>(value: T, index: number, self: T[]) =>
      self.indexOf(value) === index;
    const uniqueIds = ids.filter(onlyUnique);

    const scores = uniqueIds.map((u) => ({
      name: flattened!.find((r) => u === r.playerId)!.playerName,
      id: u,
      score: flattened.filter((id) => id.playerId === u).length,
    }));

    const sorted = sort(scores);

    sorted.push(...getPlayersWithNoScore(state.users, scores));

    return {
      scores: sorted,
    };
  }
);
