import { Question } from "games/shared/Poll/types/Question";
import { SelectedAnswer } from "games/shared/Poll/types/SelectedAnswer";
import { PresenterState } from "games/shared/Poll/types/PresenterState";

export const presenterPayloadReducer = <S extends PresenterState>(
  state: S,
  answers: SelectedAnswer[],
  playerId: string,
  playerName: string
) => {
  const questions: Question[] = state.questions.map((q) => {
    const answer = answers.find((a) => a.questionId === q.id);
    if (answer) {
      return {
        ...q,
        responses: [
          ...q.responses.filter((r) => r.playerId !== playerId),
          { playerName, playerId, answerId: answer.answerId },
        ],
      };
    } else {
      return q;
    }
  });
  return {
    ...state,
    questions,
  };
};
