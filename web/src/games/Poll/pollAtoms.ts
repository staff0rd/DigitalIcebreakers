import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { registerGame } from "../../store/jotai/gameMessageHandlers";
import { PollPresenterState } from "../shared/Poll/types/PresenterState";
import { PollPlayerState } from "../shared/Poll/types/PlayerState";
import { Question } from "../shared/Poll/types/Question";
import { SelectedAnswer } from "../shared/Poll/types/SelectedAnswer";

export interface PollState {
  presenter: PollPresenterState;
  player: PollPlayerState;
}

const POLL_STORAGE_KEY = "poll:questions";

// Storage atom for questions (persisted in localStorage)
const pollQuestionsStorageAtom = atomWithStorage<Question[]>(POLL_STORAGE_KEY, []);

// Main poll atom combining storage with runtime state
export const pollAtom = atom<PollState>({
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

// Derived atom that includes localStorage questions in presenter state
export const pollStateAtom = atom(
  (get) => {
    const state = get(pollAtom);
    const storedQuestions = get(pollQuestionsStorageAtom);

    return {
      ...state,
      presenter: {
        ...state.presenter,
        questions: storedQuestions,
      },
    };
  },
  (get, set, update: PollState) => {
    set(pollAtom, update);

    // Update localStorage when questions change
    if (update.presenter.questions !== get(pollAtom).presenter.questions) {
      set(pollQuestionsStorageAtom, update.presenter.questions);
    }
  }
);

// Action atoms for presenter actions
export const setCurrentQuestionIdAtom = atom(null, (get, set, questionId: string | undefined) => {
  const currentState = get(pollStateAtom);
  set(pollStateAtom, {
    ...currentState,
    presenter: {
      ...currentState.presenter,
      currentQuestionId: questionId,
    },
  });
});

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
  set(pollStateAtom, {
    ...currentState,
    presenter: {
      ...currentState.presenter,
      questions,
    },
  });
});

// Action atoms for player actions
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

// Message handler for Poll
const handlePollMessage = (
  currentState: PollState,
  message: any,
  isPresenter: boolean
): PollState => {
  // Handle both wrapped and unwrapped messages
  const payload = message.payload || message;

  if (isPresenter) {
    // Presenter receiving player responses
    if (message.id && message.name && message.payload) {
      const { id: playerId, name: playerName, payload: answers } = message;

      if (Array.isArray(answers) && answers.length > 0) {
        const selectedAnswers: SelectedAnswer[] = answers;

        // Update responses for each question
        const updatedQuestions = currentState.presenter.questions.map((question) => {
          // Remove existing responses from this player
          const filteredResponses = question.responses.filter(
            (response) => response.playerId !== playerId
          );

          // Find the answer for this question
          const answerForThisQuestion = selectedAnswers.find(
            (answer) => answer.questionId === question.id
          );

          if (answerForThisQuestion) {
            // Add new response
            return {
              ...question,
              responses: [
                ...filteredResponses,
                {
                  playerId,
                  playerName,
                  answerId: answerForThisQuestion.answerId,
                },
              ],
            };
          }

          return question;
        });

        return {
          ...currentState,
          presenter: {
            ...currentState.presenter,
            questions: updatedQuestions,
          },
        };
      }
    }
  } else {
    // Player receiving available answers from server
    if (payload.questionId && payload.answers) {
      return {
        ...currentState,
        player: {
          ...currentState.player,
          questionId: payload.questionId,
          question: payload.question || "",
          answers: payload.answers || [],
          selectedAnswerId: payload.selectedAnswerId,
          answerLocked: !!payload.selectedAnswerId,
        },
      };
    }
  }

  return currentState;
};

// Register the game with the SignalR middleware
registerGame("poll", pollStateAtom, handlePollMessage);