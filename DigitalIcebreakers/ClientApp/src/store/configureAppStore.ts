import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { rootReducer } from './rootReducer'

export function configureAppStore() {
  const store = configureStore({
    reducer: rootReducer,
    middleware: [...getDefaultMiddleware()]
  })

  // if (process.env.NODE_ENV !== 'production' && module.hot) {
  //   module.hot.accept('./reducers', () => store.replaceReducer(rootReducer))
  // }

  return store
}