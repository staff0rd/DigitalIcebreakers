import { createAction } from '@reduxjs/toolkit';

import { GameMessage } from "../games/GameMessage";

type InterfaceType = 'client' | 'presenter';

export const createGameAction = <T,>(gameName: string, interfaceType: InterfaceType, actionType: string) => 
    createAction<T>(`${gameName}-${interfaceType}-${actionType}`);

export const createGameMessageReceivedAction = <T,>(gameName: string, interfaceType: InterfaceType, actionType: string) =>
    createGameAction<GameMessage<T>>(gameName, interfaceType, actionType);