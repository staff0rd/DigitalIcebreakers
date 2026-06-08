import { atom } from "jotai";
import { atomWithStorage, createJSONStorage } from "jotai/utils";
import { GameMessage } from "games/GameMessage";
import {
  GameMessageHandler,
  registerGame,
} from "../../store/jotai/gameMessageHandlers";

export const Name = "retrospective";

export type Category = {
  id: number;
  name: string;
};

export type PayloadFromParticipant = {
  category: number;
  message: string;
};

export interface RetrospectivePresenterState {
  ideas: GameMessage<PayloadFromParticipant>[];
  categories: Category[];
}

export interface RetrospectiveParticipantState {
  categories: Category[];
}

export interface RetrospectiveState {
  presenter: RetrospectivePresenterState;
  participant: RetrospectiveParticipantState;
}

// "retrospective" matches the legacy StorageManager key so existing saved boards survive the migration
const presenterAtom = atomWithStorage<RetrospectivePresenterState>(
  "retrospective",
  { ideas: [], categories: [] },
  createJSONStorage<RetrospectivePresenterState>(),
  { getOnInit: true }
);

const participantCategoriesAtom = atom<Category[]>([]);

export const retrospectiveAtom = atom(
  (get) => ({
    presenter: get(presenterAtom),
    participant: { categories: get(participantCategoriesAtom) },
  }),
  (get, set, update: RetrospectiveState) => {
    set(presenterAtom, update.presenter);
    set(participantCategoriesAtom, update.participant.categories);
  }
);

export const setCategoriesAtom = atom(
  null,
  (get, set, categories: Category[]) => {
    set(presenterAtom, { ideas: [], categories: [...categories] });
  }
);

export const clearIdeasAtom = atom(null, (get, set) => {
  set(presenterAtom, { ...get(presenterAtom), ideas: [] });
});

const retrospectiveMessageHandler: GameMessageHandler<RetrospectiveState> = (
  currentState,
  message,
  isPresenter
) => {
  if (isPresenter) {
    if (message?.payload) {
      return {
        ...currentState,
        presenter: {
          ...currentState.presenter,
          ideas: [...currentState.presenter.ideas, message],
        },
      };
    }
    return currentState;
  }
  if (message?.categories) {
    return {
      ...currentState,
      participant: { categories: [...message.categories] },
    };
  }
  return currentState;
};

registerGame(Name, retrospectiveAtom, retrospectiveMessageHandler);
