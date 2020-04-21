import { Answer } from "./Answer";
import { GameMessage } from "../GameMessage";

export type Question = {
    id: string;
    order: number;
    text: string;
    answers: Answer[];
    isVisible: boolean;
    responses: GameMessage<Answer>[];
}