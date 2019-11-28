import { Middleware, MiddlewareAPI, Dispatch } from '@reduxjs/toolkit'

export const LoggerMiddleware: Middleware = ({ getState }: MiddlewareAPI) => (next: Dispatch) => action => {
    console.log('will dispatch', action);
    const returnValue = next(action);
    console.log('state after dispatch', getState());
    return returnValue;
}
