import { Answer } from "./Answer";

export interface AvailableAnswers {
    questionId: string;
    answers: Answer[];
    selectedAnswerId?: string;
}