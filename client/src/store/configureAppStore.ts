import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./rootReducer";
import { createRealTimeMiddleware } from "./realTimeMiddleware";
import { LoggerMiddleware } from "./LoggerMiddleware";

export function configureAppStore() {
  const { middleware: realTimeMiddleware, auth } = createRealTimeMiddleware();
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().prepend(realTimeMiddleware),
    // .concat(LoggerMiddleware),
  });

  // if (process.env.NODE_ENV !== 'production' && module.hot) {
  //   module.hot.accept('./reducers', () => store.replaceReducer(rootReducer))
  // }
  return { store, auth };
}

export function configureTestStore() {
  const store = configureStore({
    reducer: rootReducer,
  });
  return store;
}
