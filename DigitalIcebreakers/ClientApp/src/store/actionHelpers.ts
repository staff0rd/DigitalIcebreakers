import { createAction, createReducer, CaseReducer } from '@reduxjs/toolkit';

import { GameMessage } from "../games/GameMessage";

export type InterfaceType = 'client' | 'presenter';

export const createGameAction = <T,>(gameName: string, interfaceType: InterfaceType, actionType: string) => 
    createAction<T>(`${gameName}-${interfaceType}-${actionType}`);

export const createGameMessageReceivedAction = <T,>(gameName: string, interfaceType: InterfaceType, actionType: string) =>
    createGameAction<GameMessage<T>>(gameName, interfaceType, actionType);

export const createReceiveGameMessageReducer = <T>(gameName: string, initialState: T, caseReducer: CaseReducer<T>, interfaceType: InterfaceType = "presenter") => {
    const receiveGameMessage = createGameMessageReceivedAction<T>(gameName, interfaceType, "receive-game-message");
    return createReducer<T>(initialState, builder => {
        builder.addCase(receiveGameMessage, caseReducer);
    })
}