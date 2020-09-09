import { Question } from './Question';

export interface PollPresenterState {
    questions: Question[];
    currentQuestionId: string | undefined;
    showResponses: boolean;
}
