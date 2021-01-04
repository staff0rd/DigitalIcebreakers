import { TriviaAnswer } from "games/shared/Poll/types/Answer";

export const toggleCorrectAnswer = (
  answers: TriviaAnswer[],
  answer: TriviaAnswer
) => {
  const correct = !answers.find((a) => a.id === answer.id)!.correct;
  const result = answers.map((a) => {
    if (a.id === answer.id) {
      return {
        ...a,
        correct,
      };
    } else if (correct) {
      return {
        ...a,
        correct: false,
      };
    }
    return a;
  });

  return result;
};
