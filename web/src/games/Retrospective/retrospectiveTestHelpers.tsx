import { render } from "@testing-library/react";
import { createTheme } from "@mui/material";
import { ThemeProvider } from "@mui/styles";
import { Provider as JotaiProvider, createStore } from "jotai";
import { Provider as ReduxProvider } from "react-redux";
import { AnyAction, configureStore, Middleware } from "@reduxjs/toolkit";
import { ReactElement } from "react";
import { rootReducer } from "store/rootReducer";
import { getGameHandler } from "store/jotai/gameMessageHandlers";
import { GameMessage } from "games/GameMessage";
import {
  Category,
  Name,
  PayloadFromParticipant,
  retrospectiveAtom,
  RetrospectivePresenterState,
} from "./retrospectiveAtoms";

type JotaiStore = ReturnType<typeof createStore>;

export const createCategories = (
  names: string[] = ["Start", "Stop", "Continue"]
): Category[] => names.map((name, id) => ({ id, name }));

export const createIdeaMessage = ({
  category = 0,
  message = "an idea",
  id = "player-1",
  name = "Player One",
} = {}): GameMessage<PayloadFromParticipant> => ({
  id,
  name,
  payload: { category, message },
});

type RenderRetrospectiveOptions = {
  presenter?: Partial<RetrospectivePresenterState>;
  participantCategories?: Category[];
};

export const renderRetrospective = (
  ui: ReactElement,
  options: RenderRetrospectiveOptions = {}
) => {
  const actions: AnyAction[] = [];
  const actionRecorder: Middleware = () => (next) => (action) => {
    actions.push(action as AnyAction);
    return next(action);
  };
  const reduxStore = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(actionRecorder),
  });
  const jotaiStore = createStore();
  if (options.presenter || options.participantCategories) {
    jotaiStore.set(retrospectiveAtom, {
      presenter: { ideas: [], categories: [], ...options.presenter },
      participant: { categories: options.participantCategories ?? [] },
    });
  }
  return {
    ...render(
      <ThemeProvider theme={createTheme({})}>
        <ReduxProvider store={reduxStore}>
          <JotaiProvider store={jotaiStore}>{ui}</JotaiProvider>
        </ReduxProvider>
      </ThemeProvider>
    ),
    jotaiStore,
    actions,
  };
};

export const receiveGameMessage = (
  jotaiStore: JotaiStore,
  message: unknown,
  isPresenter: boolean
) => {
  const handler = getGameHandler(Name);
  const currentState = jotaiStore.get(retrospectiveAtom);
  jotaiStore.set(
    retrospectiveAtom,
    handler!.messageHandler(currentState, message, isPresenter)
  );
};
