import { Answer } from "./Answer";
import { Response } from './Response';

export type Question = {
    id: string;
    text: string;
    answers: Answer[];
    responses: Response[];
}