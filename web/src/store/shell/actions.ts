import { ShellActionTypes, GO_TO_DEFAULT_URL, NAVIGATE } from "./types";

export function goToDefaultUrl(): ShellActionTypes {
  return { type: GO_TO_DEFAULT_URL };
}

export function navigate(path: string): ShellActionTypes {
  return { type: NAVIGATE, path };
}
