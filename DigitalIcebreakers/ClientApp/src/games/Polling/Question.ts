import { Answer } from "./Answer";
import { GameMessage } from "../GameMessage";

export type Question = {
    id: string;
    text: string;
    answers: Answer[];
    responses: GameMessage<Answer>[];
}