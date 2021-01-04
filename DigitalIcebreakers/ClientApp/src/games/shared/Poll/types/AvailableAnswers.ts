import { Answer } from "./Answer";

export interface AvailableAnswers<T extends Answer> {
  questionId: string;
  answers: T[];
  selectedAnswerId?: string;
  question: string;
}
