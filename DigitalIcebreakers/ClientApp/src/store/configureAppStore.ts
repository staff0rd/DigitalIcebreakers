import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { rootReducer } from './rootReducer'
import { SignalRMiddleware } from './SignalRMiddleware'
import { LoggerMiddleware } from './LoggerMiddleware'

export function configureAppStore() {
  const store = configureStore({
    reducer: rootReducer,
    middleware: [
      LoggerMiddleware,
      SignalRMiddleware(), 
      ...getDefaultMiddleware()
    ]
  })

  // if (process.env.NODE_ENV !== 'production' && module.hot) {
  //   module.hot.accept('./reducers', () => store.replaceReducer(rootReducer))
  // }

  return store
}
