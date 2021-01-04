export type Answer = {
  id: string;
  text: string;
};

export type TriviaAnswer = Answer &  {
  correct: boolean;
}
