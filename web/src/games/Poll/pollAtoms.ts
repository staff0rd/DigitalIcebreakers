import { atom } from "jotai";
import { atomWithStorage, createJSONStorage } from "jotai/utils";
import { registerGame } from "../../store/jotai/gameMessageHandlers";
import { PollPresenterState } from "../shared/Poll/types/PresenterState";
import { PollPlayerState } from "../shared/Poll/types/PlayerState";
import { Question } from "../shared/Poll/types/Question";
import { SelectedAnswer } from "../shared/Poll/types/SelectedAnswer";
import { GameMessage } from "../GameMessage";
import { shuffle } from "Random";

export interface PollState {
  presenter: PollPresenterState;
  player: PollPlayerState;
}

// "poll:questions" matches the legacy StorageManager key so existing saved questions survive the migration
const POLL_STORAGE_KEY = "poll:questions";

const pollQuestionsStorageAtom = atomWithStorage<Question[]>(
  POLL_STORAGE_KEY,
  [],
  createJSONStorage<Question[]>(),
  { getOnInit: true }
);

const pollAtom = atom<PollState>({
  presenter: {
    questions: [],
    currentQuestionId: undefined,
    showResponses: false,
  },
  player: {
    questionId: "",
    question: "",
    answers: [],
    selectedAnswerId: undefined,
    answerLocked: false,
  },
});

// Combines persisted questions with runtime state; writes persist question changes
export const pollStateAtom = atom(
  (get) => {
    const state = get(pollAtom);

    return {
      ...state,
      presenter: {
        ...state.presenter,
        questions: get(pollQuestionsStorageAtom),
      },
    };
  },
  (get, set, update: PollState) => {
    if (update.presenter.questions !== get(pollQuestionsStorageAtom)) {
      set(pollQuestionsStorageAtom, update.presenter.questions);
    }
    set(pollAtom, update);
  }
);

export const setCurrentQuestionIdAtom = atom(
  null,
  (get, set, questionId: string | undefined) => {
    const currentState = get(pollStateAtom);
    set(pollStateAtom, {
      ...currentState,
      presenter: {
        ...currentState.presenter,
        currentQuestionId: questionId,
        // Polls have no answers to hide, so navigating shows the responses straight away
        showResponses: true,
      },
    });
  }
);

export const toggleResponsesAtom = atom(null, (get, set) => {
  const currentState = get(pollStateAtom);
  set(pollStateAtom, {
    ...currentState,
    presenter: {
      ...currentState.presenter,
      showResponses: !currentState.presenter.showResponses,
    },
  });
});

export const setQuestionsAtom = atom(null, (get, set, questions: Question[]) => {
  const currentState = get(pollStateAtom);
  const currentQuestionId = questions.some(
    (q) => q.id === currentState.presenter.currentQuestionId
  )
    ? currentState.presenter.currentQuestionId
    : questions[0]?.id;
  set(pollStateAtom, {
    ...currentState,
    presenter: {
      ...currentState.presenter,
      questions,
      currentQuestionId,
    },
  });
});

export const selectAnswerAtom = atom(null, (get, set, answerId: string) => {
  const currentState = get(pollStateAtom);
  set(pollStateAtom, {
    ...currentState,
    player: {
      ...currentState.player,
      selectedAnswerId: answerId,
    },
  });
});

export const lockAnswerAtom = atom(null, (get, set) => {
  const currentState = get(pollStateAtom);
  set(pollStateAtom, {
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
  answers: PollPlayerState["answers"];
  selectedAnswerId?: string;
};

const handlePollMessage = (
  currentState: PollState,
  message: GameMessage<SelectedAnswer[]> | AvailableAnswersPayload | null,
  isPresenter: boolean
): PollState => {
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

  const payload = message as AvailableAnswersPayload;

  if (payload.questionId && payload.answers) {
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

const initialPlayerState = (): PollState["player"] => ({
  questionId: "",
  question: "",
  answers: [],
  selectedAnswerId: undefined,
  answerLocked: false,
});

registerGame("poll", pollStateAtom, handlePollMessage, {
  resetState: (current) => ({
    presenter: {
      questions: current.presenter.questions.map((question) => ({
        ...question,
        responses: [],
      })),
      currentQuestionId: current.presenter.currentQuestionId,
      showResponses: false,
    },
    player: initialPlayerState(),
  }),
});
