import { atom } from "jotai";
import { atomWithStorage, createJSONStorage } from "jotai/utils";
import { registerGame } from "../../store/jotai/gameMessageHandlers";
import { TriviaPresenterState } from "../shared/Poll/types/PresenterState";
import { TriviaPlayerState } from "../shared/Poll/types/PlayerState";
import { Question } from "../shared/Poll/types/Question";
import { SelectedAnswer } from "../shared/Poll/types/SelectedAnswer";
import { GameMessage } from "../GameMessage";
import { shuffle } from "Random";

export interface TriviaState {
  presenter: TriviaPresenterState;
  player: TriviaPlayerState;
}

// "trivia:questions" matches the legacy StorageManager key so existing saved questions survive the migration
const TRIVIA_STORAGE_KEY = "trivia:questions";

const triviaQuestionsStorageAtom = atomWithStorage<Question[]>(
  TRIVIA_STORAGE_KEY,
  [],
  createJSONStorage<Question[]>(),
  { getOnInit: true }
);

const triviaAtom = atom<TriviaState>({
  presenter: {
    questions: [],
    currentQuestionId: undefined,
    showResponses: false,
    showScoreBoard: false,
  },
  player: {
    questionId: "",
    question: "",
    answers: [],
    selectedAnswerId: undefined,
    answerLocked: false,
    canAnswer: false,
  },
});

// Combines persisted questions with runtime state; writes persist question changes
export const triviaStateAtom = atom(
  (get) => {
    const state = get(triviaAtom);

    return {
      ...state,
      presenter: {
        ...state.presenter,
        questions: get(triviaQuestionsStorageAtom),
      },
    };
  },
  (get, set, update: TriviaState) => {
    if (update.presenter.questions !== get(triviaQuestionsStorageAtom)) {
      set(triviaQuestionsStorageAtom, update.presenter.questions);
    }
    set(triviaAtom, update);
  }
);

export const setCurrentQuestionIdAtom = atom(
  null,
  (get, set, questionId: string | undefined) => {
    const currentState = get(triviaStateAtom);
    const newQuestion = currentState.presenter.questions.find(
      (q) => q.id === questionId
    );
    // Selecting a question with a correct answer must hide responses so players can't see it
    const hasCorrectAnswer = !!newQuestion?.answers.some((a) => a.correct);
    set(triviaStateAtom, {
      ...currentState,
      presenter: {
        ...currentState.presenter,
        currentQuestionId: questionId,
        showScoreBoard: false,
        showResponses: hasCorrectAnswer
          ? false
          : currentState.presenter.showResponses,
      },
    });
  }
);

export const toggleResponsesAtom = atom(null, (get, set) => {
  const currentState = get(triviaStateAtom);
  set(triviaStateAtom, {
    ...currentState,
    presenter: {
      ...currentState.presenter,
      showResponses: !currentState.presenter.showResponses,
    },
  });
});

export const toggleScoreBoardAtom = atom(null, (get, set) => {
  const currentState = get(triviaStateAtom);
  set(triviaStateAtom, {
    ...currentState,
    presenter: {
      ...currentState.presenter,
      showScoreBoard: !currentState.presenter.showScoreBoard,
    },
  });
});

export const setQuestionsAtom = atom(null, (get, set, questions: Question[]) => {
  const currentState = get(triviaStateAtom);
  const currentQuestionId = questions.some(
    (q) => q.id === currentState.presenter.currentQuestionId
  )
    ? currentState.presenter.currentQuestionId
    : questions[0]?.id;
  set(triviaStateAtom, {
    ...currentState,
    presenter: {
      ...currentState.presenter,
      questions,
      currentQuestionId,
    },
  });
});

export const selectAnswerAtom = atom(null, (get, set, answerId: string) => {
  const currentState = get(triviaStateAtom);
  set(triviaStateAtom, {
    ...currentState,
    player: {
      ...currentState.player,
      selectedAnswerId: answerId,
    },
  });
});

export const lockAnswerAtom = atom(null, (get, set) => {
  const currentState = get(triviaStateAtom);
  set(triviaStateAtom, {
    ...currentState,
    player: {
      ...currentState.player,
      answerLocked: true,
    },
  });
});

type AvailableAnswersPayload = {
  questionId: string;
  question?: string;
  answers: TriviaPlayerState["answers"];
  selectedAnswerId?: string;
};

type CanAnswerPayload = {
  canAnswer: boolean;
};

type TriviaClientMessage = AvailableAnswersPayload | CanAnswerPayload;

const handleTriviaMessage = (
  currentState: TriviaState,
  message: GameMessage<SelectedAnswer[]> | TriviaClientMessage | null,
  isPresenter: boolean
): TriviaState => {
  if (!message) {
    return currentState;
  }

  if (isPresenter) {
    const { id: playerId, name: playerName, payload } =
      message as GameMessage<SelectedAnswer[] | SelectedAnswer>;
    const answers = Array.isArray(payload) ? payload : payload ? [payload] : [];

    if (playerId && playerName && answers.length) {
      const updatedQuestions = currentState.presenter.questions.map(
        (question) => {
          const answerForThisQuestion = answers.find(
            (answer) => answer.questionId === question.id
          );

          if (!answerForThisQuestion) {
            return question;
          }

          return {
            ...question,
            responses: [
              ...question.responses.filter(
                (response) => response.playerId !== playerId
              ),
              {
                playerId,
                playerName,
                answerId: answerForThisQuestion.answerId,
              },
            ],
          };
        }
      );

      return {
        ...currentState,
        presenter: {
          ...currentState.presenter,
          questions: updatedQuestions,
        },
      };
    }

    return currentState;
  }

  const payload = message as TriviaClientMessage;

  if ("canAnswer" in payload && payload.canAnswer !== undefined) {
    return {
      ...currentState,
      player: {
        ...currentState.player,
        canAnswer: payload.canAnswer,
      },
    };
  }

  if ("questionId" in payload && payload.questionId && payload.answers) {
    // A re-broadcast of the current question (e.g. presenter refresh) must
    // not discard the player's selection or lock
    if (payload.questionId === currentState.player.questionId) {
      return currentState;
    }
    return {
      ...currentState,
      player: {
        ...currentState.player,
        questionId: payload.questionId,
        question: payload.question || "",
        // The presenter broadcasts one answer order for everyone, so each
        // player shuffles locally
        answers: shuffle([...payload.answers]),
        selectedAnswerId: payload.selectedAnswerId,
        answerLocked: !!payload.selectedAnswerId,
      },
    };
  }

  return currentState;
};

const initialPlayerState = (): TriviaState["player"] => ({
  questionId: "",
  question: "",
  answers: [],
  selectedAnswerId: undefined,
  answerLocked: false,
  canAnswer: false,
});

registerGame("trivia", triviaStateAtom, handleTriviaMessage, {
  resetState: (current) => ({
    presenter: {
      questions: current.presenter.questions.map((question) => ({
        ...question,
        responses: [],
      })),
      currentQuestionId: current.presenter.currentQuestionId,
      showResponses: false,
      showScoreBoard: false,
    },
    player: initialPlayerState(),
  }),
});
