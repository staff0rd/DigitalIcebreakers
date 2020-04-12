import { SET_USER, UserActionTypes, SET_USER_NAME } from './types';
import { Player } from '../../Player';

export function setUser(user: Player) : UserActionTypes {
    return { type: SET_USER, user }
}

export function setUserName(name: string) : UserActionTypes {
    return { type: SET_USER_NAME, name};
}