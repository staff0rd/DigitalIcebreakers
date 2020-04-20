import { createAction, createReducer, CaseReducer, Action } from '@reduxjs/toolkit';

import { GameMessage } from "../games/GameMessage";

export type InterfaceType = 'client' | 'presenter';

export type ActionWithPayload<T> = {
    payload: T;
} & Action<string>;

export const createGameAction = <T,>(gameName: string, interfaceType: InterfaceType, actionType: string) => 
    createAction<T>(`${gameName}-${interfaceType}-${actionType}`);

export const createGameMessageReceivedAction = <T,>(gameName: string, interfaceType: InterfaceType, actionType: string) =>
    createGameAction<GameMessage<T>>(gameName, interfaceType, actionType);

export const createReceiveGameMessageReducer = <Payload, ReduxState = Payload>(gameName: string, initialState: ReduxState, caseReducer: CaseReducer<ReduxState, ActionWithPayload<GameMessage<Payload>>>, interfaceType: InterfaceType = "presenter") => {
    const receiveGameMessage = createGameMessageReceivedAction<Payload>(gameName, interfaceType, "receive-game-message");
    return createReducer<ReduxState>(initialState, builder => {
        builder.addCase(receiveGameMessage, caseReducer);
    })
}