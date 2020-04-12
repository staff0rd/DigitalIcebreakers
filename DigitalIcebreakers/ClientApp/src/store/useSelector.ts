import {
    useSelector as useReduxSelector,
    TypedUseSelectorHook,
  } from 'react-redux'
  import { RootState } from './RootState'
  
  export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector