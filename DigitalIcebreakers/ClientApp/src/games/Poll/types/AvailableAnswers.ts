import { Answer } from "./Answer";

export type AvailableAnswers = {
    questionId: string;
    answers: Answer[];
    selectedAnswerId?: string;
}