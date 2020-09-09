import { AvailableAnswers } from './AvailableAnswers';

export interface PollPlayerState extends AvailableAnswers {
    selectedAnswerId?: string;
    answerLocked: boolean;
}
