import { AnyAction, configureStore, Dispatch } from "@reduxjs/toolkit";
import { rootReducer } from "./rootReducer";
import { SignalRMiddlewareWithJotai } from "./SignalRMiddlewareWithJotai";
//import logger from "redux-logger";
import { connectionFactory } from "./connectionFactory";
import { navigationMiddleware } from "./navigationMiddleware";

export function configureAppStore() {
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat([
        navigationMiddleware,
        SignalRMiddlewareWithJotai(connectionFactory)
      ]),
    //.concat(logger),
  });
  return store;
}

// Middleware-only command actions (e.g. SET_USER_NAME, CONNECTION_CONNECT) have
// no reducer, so widen dispatch beyond the reducer-derived action union.
export type AppDispatch = Dispatch<AnyAction>;
