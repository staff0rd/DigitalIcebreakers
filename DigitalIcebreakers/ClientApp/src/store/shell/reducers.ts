import { Config } from '../../config';

import {
    ShellState, ShellActionTypes, SET_MENU_ITEMS, TOGGLE_MENU
} from './types'
import { Events } from '../../Events';

const initialState: ShellState = {
    version: Config.version,
    menuItems: [],
    showMenu: true
}

export function shellReducer(
    state = initialState,
    action: ShellActionTypes
): ShellState {
    switch (action.type) {
        case SET_MENU_ITEMS: 
            return {
                ...state,
                menuItems: action.items
            }
        case TOGGLE_MENU: {
            // TODO: remove this
            Events.emit("menu-visibility")
            return {
                ...state,
                showMenu: action.show
            }
        }
        default: return state
    }
}