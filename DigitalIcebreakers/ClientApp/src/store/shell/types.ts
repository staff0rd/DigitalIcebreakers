export interface ShellState {
    menuItems: JSX.Element[];
    version: string;
    showMenu: boolean;
    showDrawer: boolean;
}

export const TOGGLE_MENU = 'TOGGLE_MENU';
export const TOGGLE_DRAWER = 'TOGGLE_DRAWER';
export const SET_MENU_ITEMS = 'SET_MENU_ITEMS';
export const GO_TO_DEFAULT_URL = 'GO_TO_DEFAULT_URL';

interface ToggleMenuAction {
    type: typeof TOGGLE_MENU;
    show: boolean;
}

interface ToggleDrawerAction {
    type: typeof TOGGLE_DRAWER;
    show?: boolean;
}

interface SetMenuItemsAction {
    type: typeof SET_MENU_ITEMS;
    items: JSX.Element[];
}

interface GoToDefaultUrlAction {
    type: typeof GO_TO_DEFAULT_URL;
    ignoreJoin?: boolean;
}

export type ShellActionTypes = ToggleMenuAction | SetMenuItemsAction | GoToDefaultUrlAction | ToggleDrawerAction;