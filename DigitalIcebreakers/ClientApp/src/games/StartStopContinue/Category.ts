import { GameMessage } from "games/GameMessage";
import { PlayerPayload } from "./Player";

export enum Category {
  Start,
  Stop,
  Continue,
}

export type Categories = keyof typeof Category;

export const getCategories = () =>
  Object.keys(Category).filter((key) => isNaN(Number(key)));

export const ideasByCategory = (
  ideas: GameMessage<PlayerPayload>[],
  category: string
) =>
  ideas.filter(
    (idea) => idea.payload.category === Category[category as Categories]
  );
