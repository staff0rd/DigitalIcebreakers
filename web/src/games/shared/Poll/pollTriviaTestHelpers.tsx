import { render } from "@testing-library/react";
import { createTheme } from "@mui/material";
import { ThemeProvider } from "@mui/styles";
import { Provider as JotaiProvider, createStore } from "jotai";
import { Provider as ReduxProvider } from "react-redux";
import { AnyAction, configureStore, Middleware } from "@reduxjs/toolkit";
import { ReactElement } from "react";
import { rootReducer } from "store/rootReducer";
import { getGameHandler } from "store/jotai/gameMessageHandlers";
import { setLobbyGame, setLobbyPlayers } from "store/lobby/actions";
import { Player } from "Player";
import { Answer } from "./types/Answer";
import { Question } from "./types/Question";
import {
  PollPresenterState,
  TriviaPresenterState,
} from "./types/PresenterState";
import { pollStateAtom } from "games/Poll/pollAtoms";
import { triviaStateAtom } from "games/Trivia/triviaAtoms";

type JotaiStore = ReturnType<typeof createStore>;

export const createAnswer = (overrides: Partial<Answer> = {}): Answer => ({
  id: "answer-1",
  text: "an answer",
  ...overrides,
});

export const createQuestion = (
  overrides: Partial<Question> = {}
): Question => ({
  id: "question-1",
  text: "a question",
  answers: [createAnswer()],
  responses: [],
  ...overrides,
});

export const createPlayers = (count = 2): Player[] =>
  Array.from({ length: count }, (_, ix) => ({
    id: `player-${ix + 1}`,
    name: `Player ${ix + 1}`,
  }));

type RenderPollTriviaOptions = {
  pollPresenter?: Partial<PollPresenterState>;
  triviaPresenter?: Partial<TriviaPresenterState>;
  players?: Player[];
  currentGame?: string;
};

export const renderPollTrivia = (
  ui: ReactElement,
  options: RenderPollTriviaOptions = {}
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
  if (options.players) {
    reduxStore.dispatch(setLobbyPlayers(options.players));
  }
  if (options.currentGame) {
    reduxStore.dispatch(setLobbyGame(options.currentGame));
  }
  const jotaiStore = createStore();
  if (options.pollPresenter) {
    jotaiStore.set(pollStateAtom, {
      presenter: {
        questions: [],
        currentQuestionId: undefined,
        showResponses: false,
        ...options.pollPresenter,
      },
      player: {
        questionId: "",
        question: "",
        answers: [],
        answerLocked: false,
      },
    });
  }
  if (options.triviaPresenter) {
    jotaiStore.set(triviaStateAtom, {
      presenter: {
        questions: [],
        currentQuestionId: undefined,
        showResponses: false,
        showScoreBoard: false,
        ...options.triviaPresenter,
      },
      player: {
        questionId: "",
        question: "",
        answers: [],
        answerLocked: false,
        canAnswer: false,
      },
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
  gameName: string,
  message: unknown,
  isPresenter: boolean
) => {
  const handler = getGameHandler(gameName);
  const currentState = jotaiStore.get(handler!.atom);
  jotaiStore.set(
    handler!.atom,
    handler!.messageHandler(currentState, message, isPresenter)
  );
};
