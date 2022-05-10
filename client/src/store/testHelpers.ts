import { AnyAction } from "redux";
import { RootState } from "./RootState";
import { RealTimeMiddleware } from "./RealTimeMiddleware";
import { configureTestStore } from "./configureAppStore";

export const createMiddleware = (state: Partial<RootState> = {}) => {
  const store = configureTestStore();
  const next = jest.fn();

  const invoke = (action: AnyAction) =>
    RealTimeMiddleware()(store)(next)(action);

  return { store, next, invoke };
};
