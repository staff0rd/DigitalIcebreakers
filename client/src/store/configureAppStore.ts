import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./rootReducer";
import { RealTimeMiddleware } from "./RealTimeMiddleware";
import { LoggerMiddleware } from "./LoggerMiddleware";

export function configureAppStore() {
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .concat(LoggerMiddleware)
        .concat(RealTimeMiddleware()),
  });

  // if (process.env.NODE_ENV !== 'production' && module.hot) {
  //   module.hot.accept('./reducers', () => store.replaceReducer(rootReducer))
  // }
  return store;
}
