import {
  useSelector as useReduxSelector,
  TypedUseSelectorHook,
  useDispatch as useReduxDispatch,
} from "react-redux";
import { RootState } from "./RootState";
import { AppDispatch } from "./configureAppStore";

export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;
export const useDispatch = useReduxDispatch.withTypes<AppDispatch>();
