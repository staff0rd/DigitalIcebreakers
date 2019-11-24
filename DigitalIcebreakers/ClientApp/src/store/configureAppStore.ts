import { configureStore, getDefaultMiddleware, Middleware, MiddlewareAPI, Dispatch } from '@reduxjs/toolkit'
import { rootReducer } from './rootReducer'

export function configureAppStore() {
  const store = configureStore({
    reducer: rootReducer,
    middleware: [loggerMiddleware, ...getDefaultMiddleware()]
  })

  // if (process.env.NODE_ENV !== 'production' && module.hot) {
  //   module.hot.accept('./reducers', () => store.replaceReducer(rootReducer))
  // }

  return store
}

const loggerMiddleware: Middleware = ({ getState }: MiddlewareAPI) => (
  next: Dispatch
) => action => {
  console.log('will dispatch', action)
  const returnValue = next(action)
  console.log('state after dispatch', getState())
  return returnValue
}