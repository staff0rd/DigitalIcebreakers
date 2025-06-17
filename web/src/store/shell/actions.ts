import {
  ShellActionTypes,
  TOGGLE_MENU,
  TOGGLE_DRAWER,
  SET_MENU_ITEMS,
  GO_TO_DEFAULT_URL,
  NAVIGATE,
} from "./types";

export function toggleMenu(show: boolean): ShellActionTypes {
  return { type: TOGGLE_MENU, show };
}

export function toggleDrawer(show?: boolean): ShellActionTypes {
  return { type: TOGGLE_DRAWER, show };
}

export function setMenuItems(items: Element[]): ShellActionTypes {
  return { type: SET_MENU_ITEMS, items };
}

export function goToDefaultUrl(): ShellActionTypes {
  return { type: GO_TO_DEFAULT_URL };
}

export function navigate(path: string): ShellActionTypes {
  return { type: NAVIGATE, path };
}
