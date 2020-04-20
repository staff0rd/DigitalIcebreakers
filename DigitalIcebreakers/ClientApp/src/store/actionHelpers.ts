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

export const createReceiveGameMessageReducer = <ServerState, ReduxState = ServerState>(gameName: string, initialState: ReduxState, caseReducer: CaseReducer<ReduxState, ActionWithPayload<GameMessage<ServerState>>>, interfaceType: InterfaceType = "presenter") => {
    const receiveGameMessage = createGameMessageReceivedAction<ServerState>(gameName, interfaceType, "receive-game-message");
    return createReducer<ReduxState>(initialState, builder => {
        builder.addCase(receiveGameMessage, caseReducer);
    })
}