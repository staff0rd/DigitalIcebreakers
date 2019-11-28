export interface ShellState {
    menuItems: JSX.Element[];
    version: string;
    showMenu: boolean;
}

export const TOGGLE_MENU = 'TOGGLE_MENU';
export const SET_MENU_ITEMS = 'SET_MENU_ITEMS';

interface ToggleMenuAction {
    type: typeof TOGGLE_MENU;
    show: boolean;
}

interface SetMenuItemsAction {
    type: typeof SET_MENU_ITEMS;
    items: JSX.Element[];
}

export type ShellActionTypes = ToggleMenuAction | SetMenuItemsAction;