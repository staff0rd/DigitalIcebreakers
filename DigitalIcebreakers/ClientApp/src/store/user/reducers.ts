import {
    UserState,
    UserActionTypes,
    SET_USER,
    SET_USER_NAME
} from './types'

const initialState: UserState = {
    id: "",
    name: ""
}

export function userReducer(
    state = initialState,
    action: UserActionTypes
): UserState {
    switch (action.type) {
        case SET_USER_NAME: {
            return {
                ...state,
                name: action.name
            }
        }
        case SET_USER: {
            return {
                ...state,
                id: action.user.id,
                name: action.user.name
            }
        }
        default:
            return state
    }
}