export enum Category {
  Start,
  Stop,
  Continue,
}

export type Categories = keyof typeof Category;

export const getCategories = () =>
  Object.keys(Category).filter((key) => isNaN(Number(key)));
