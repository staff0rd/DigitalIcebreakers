export const GO_TO_DEFAULT_URL = "GO_TO_DEFAULT_URL";
export const NAVIGATE = "NAVIGATE";

interface GoToDefaultUrlAction {
  type: typeof GO_TO_DEFAULT_URL;
}

interface NavigateAction {
  type: typeof NAVIGATE;
  path: string;
}

export type ShellActionTypes = GoToDefaultUrlAction | NavigateAction;
