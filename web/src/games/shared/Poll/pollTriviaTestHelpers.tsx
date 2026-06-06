import { render } from "@testing-library/react";
import { createTheme } from "@mui/material";
import { ThemeProvider } from "@mui/styles";
import { Provider as JotaiProvider, createStore } from "jotai";
import { ReactElement } from "react";
import { getGameHandler } from "store/jotai/gameMessageHandlers";
import { initializeMockTransport } from "store/jotai/transportTestHelpers";
import { lobbyAtom, initialLobbyState } from "store/atoms/lobbyAtoms";
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
  const jotaiStore = createStore();
  const signalR = initializeMockTransport(jotaiStore);
  jotaiStore.set(lobbyAtom, {
    ...initialLobbyState,
    players: options.players ?? [],
    currentGame: options.currentGame ?? "",
  });
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
        <JotaiProvider store={jotaiStore}>{ui}</JotaiProvider>
      </ThemeProvider>
    ),
    jotaiStore,
    ...signalR,
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
