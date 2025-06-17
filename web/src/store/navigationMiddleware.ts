import { Middleware, UnknownAction } from "@reduxjs/toolkit";
import { NAVIGATE } from "./shell/types";

interface NavigateAction extends UnknownAction {
  type: typeof NAVIGATE;
  path: string;
}

export const navigationMiddleware: Middleware = () => (next) => (action: UnknownAction) => {
  if (action.type === NAVIGATE) {
    const navigateAction = action as NavigateAction;
    const event = new CustomEvent("navigate-action", {
      detail: { path: navigateAction.path }
    });
    window.dispatchEvent(event);
  }
  return next(action);
};