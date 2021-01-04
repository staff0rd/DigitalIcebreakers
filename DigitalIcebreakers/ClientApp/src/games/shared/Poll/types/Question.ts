import { Answer } from "./Answer";
import { Response } from "./Response";

export type Question<T extends Answer> = {
  id: string;
  text: string;
  responses: Response[];
  answers: T[];
}
