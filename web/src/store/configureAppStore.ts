import { configureStore } from "@reduxjs/toolkit";
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

export type AppDispatch = ReturnType<typeof configureAppStore>["dispatch"];
