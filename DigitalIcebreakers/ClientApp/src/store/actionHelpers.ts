import { createAction, createReducer, CaseReducer, Action, ActionReducerMapBuilder, ActionCreator, PayloadActionCreator } from '@reduxjs/toolkit';

import { GameMessage } from "../games/GameMessage";

export type InterfaceType = 'client' | 'presenter';

export type ActionWithPayload<T> = {
    payload: T;
} & Action<string>;

export const createGameAction = (gameName: string, interfaceType: InterfaceType, actionType: string) =>
    createAction(`${gameName}-${interfaceType}-${actionType}`);

export const createGameActionWithPayload = <P,>(gameName: string, interfaceType: InterfaceType, actionType: string) => 
    createAction<P>(`${gameName}-${interfaceType}-${actionType}`);

export const createGameMessageReceivedAction = <P,>(gameName: string, interfaceType: InterfaceType, actionType: string) =>
    createGameActionWithPayload<GameMessage<P>>(gameName, interfaceType, actionType);

export const createReceiveGameMessageReducer = <P, ReduxState = P>(
    gameName: string,
    initialState: ReduxState,
    caseReducer: CaseReducer<ReduxState, ActionWithPayload<GameMessage<P>>>,
    interfaceType: InterfaceType = "presenter",
    builderCallback?: (builder: ActionReducerMapBuilder<ReduxState>) => void
) => {
    const receiveGameMessage = createGameMessageReceivedAction<P>(gameName, interfaceType, "receive-game-message");
    return createReducer<ReduxState>(initialState, builder => {
        builder.addCase(receiveGameMessage, caseReducer);
        builderCallback && builderCallback(builder);
    })
}

export const createReceiveReducer = <ReduxState, P = string>(
    gameName: string,
    initialState: ReduxState,
    caseReducer: CaseReducer<ReduxState, ActionWithPayload<P>>,
    interfaceType: InterfaceType = "presenter",
    builderCallback?: (builder: ActionReducerMapBuilder<ReduxState>) => void
) => {
    const receiveGameMessage = createGameActionWithPayload<P>(gameName, interfaceType, "receive-game-message");
    return createReducer<ReduxState>(initialState, builder => {
        builder.addCase(receiveGameMessage as any, caseReducer);
        builderCallback && builderCallback(builder);
    })
}