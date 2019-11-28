import { ShellActionTypes, TOGGLE_MENU, SET_MENU_ITEMS } from './types';

export function toggleMenu(show: boolean) : ShellActionTypes {
    return { type: TOGGLE_MENU, show };
}

export function setMenuItems(items: JSX.Element[]) : ShellActionTypes {
    return { type: SET_MENU_ITEMS, items};
}