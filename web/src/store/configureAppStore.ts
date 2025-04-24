import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./rootReducer";
import { SignalRMiddleware } from "./SignalRMiddleware";
import logger from "redux-logger";
import { HubConnectionBuilder } from "@microsoft/signalr";

const connectionFactory = () =>
  new HubConnectionBuilder().withUrl("/gameHub").build();

export function configureAppStore() {
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .concat([SignalRMiddleware(connectionFactory)])
        .concat(logger),
  });
  return store;
}

export type AppDispatch = ReturnType<typeof configureAppStore>["dispatch"];
