import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { registerGame } from "../../store/jotai/gameMessageHandlers";
import { TriviaPresenterState } from "../shared/Poll/types/PresenterState";
import { TriviaPlayerState } from "../shared/Poll/types/PlayerState";
import { Question } from "../shared/Poll/types/Question";
import { SelectedAnswer } from "../shared/Poll/types/SelectedAnswer";

export interface TriviaState {
  presenter: TriviaPresenterState;
  player: TriviaPlayerState;
}

const TRIVIA_STORAGE_KEY = "trivia:questions";

// Storage atom for questions (persisted in localStorage)
const triviaQuestionsStorageAtom = atomWithStorage<Question[]>(TRIVIA_STORAGE_KEY, []);

// Main trivia atom combining storage with runtime state
export const triviaAtom = atom<TriviaState>({
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

// Derived atom that includes localStorage questions in presenter state
export const triviaStateAtom = atom(
  (get) => {
    const state = get(triviaAtom);
    const storedQuestions = get(triviaQuestionsStorageAtom);

    return {
      ...state,
      presenter: {
        ...state.presenter,
        questions: storedQuestions,
      },
    };
  },
  (get, set, update: TriviaState) => {
    set(triviaAtom, update);

    // Update localStorage when questions change
    if (update.presenter.questions !== get(triviaAtom).presenter.questions) {
      set(triviaQuestionsStorageAtom, update.presenter.questions);
    }
  }
);

// Action atoms for presenter actions
export const setCurrentQuestionIdAtom = atom(null, (get, set, questionId: string | undefined) => {
  const currentState = get(triviaStateAtom);
  set(triviaStateAtom, {
    ...currentState,
    presenter: {
      ...currentState.presenter,
      currentQuestionId: questionId,
    },
  });
});

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
  set(triviaStateAtom, {
    ...currentState,
    presenter: {
      ...currentState.presenter,
      questions,
    },
  });
});

// Action atoms for player actions
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

// Message handler for Trivia
const handleTriviaMessage = (
  currentState: TriviaState,
  message: any,
  isPresenter: boolean
): TriviaState => {
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
          canAnswer: payload.canAnswer !== undefined ? payload.canAnswer : true,
        },
      };
    }
  }

  return currentState;
};

// Register the game with the SignalR middleware
registerGame("trivia", triviaStateAtom, handleTriviaMessage);