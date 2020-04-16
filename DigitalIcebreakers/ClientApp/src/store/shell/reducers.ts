import { Config } from '../../config';

import {
    ShellState, ShellActionTypes, SET_MENU_ITEMS, TOGGLE_MENU, TOGGLE_DRAWER
} from './types'
import { Events } from '../../Events';

const initialState: ShellState = {
    version: Config.version,
    menuItems: [],
    showMenu: true,
    showDrawer: false,
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
            return {
                ...state,
                showMenu: action.show
            }
        }
        case TOGGLE_DRAWER: {
            return {
                ...state,
                showDrawer: action.show === undefined ? !state.showDrawer : action.show,
            }
        }

        default: return state
    }
}