import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { Idea } from "./Idea";
import { ServerIdea } from "./ServerIdea";
import { guid } from "../../util/guid";
import { pick } from "Random";
import { Colors } from "../../Colors";
import { registerGame } from "../../store/jotai/gameMessageHandlers";

const IDEA_COLORS = [
  Colors.Amber.A200,
  Colors.Green.A200,
  Colors.LightGreen.A200,
  Colors.LightBlue.A200,
  Colors.DeepPurple.A100,
  Colors.Red.A100,
];

export interface IdeaWallState {
  dynamicSize: boolean;
  showNames: boolean;
  ideas: Idea[];
  pendingArrange: boolean;
  panOffset: { x: number; y: number };
  nextZIndex: number;
}

const getNewIdea = (playerName: string, idea: string | ServerIdea): Idea => {
  const content = (idea as ServerIdea).content || (idea as string);
  const lane = (idea as ServerIdea).lane || 0;
  return {
    id: guid(),
    playerName: playerName,
    idea: content,
    lane: lane,
    color: pick(IDEA_COLORS),
    x: undefined,
    y: undefined,
    zIndex: 1,
  };
};

const ideasAtom = atomWithStorage<Idea[]>("ideawall:ideas", []);

export const ideaWallAtom = atom<IdeaWallState>({
  dynamicSize: false,
  showNames: false,
  ideas: [],
  pendingArrange: false,
  panOffset: { x: 0, y: 0 },
  nextZIndex: 2,
});

// Derived atom that syncs ideas with localStorage
export const ideaWallWithStorageAtom = atom(
  (get) => ({
    ...get(ideaWallAtom),
    ideas: get(ideasAtom),
  }),
  (get, set, update: Partial<IdeaWallState>) => {
    const current = get(ideaWallAtom);
    const newState = { ...current, ...update };
    
    // Update main state
    set(ideaWallAtom, newState);
    
    // Update localStorage if ideas changed
    if (update.ideas !== undefined) {
      set(ideasAtom, update.ideas);
    }
  }
);

// Action atoms for presenter controls
export const toggleNamesAtom = atom(
  null,
  (get, set) => {
    const current = get(ideaWallAtom);
    set(ideaWallAtom, { ...current, showNames: !current.showNames });
  }
);

export const clearIdeasAtom = atom(
  null,
  (get, set) => {
    set(ideasAtom, []);
  }
);

export const arrangeIdeasAtom = atom(
  null,
  (get, set, pending: boolean) => {
    const current = get(ideaWallAtom);
    set(ideaWallAtom, { ...current, pendingArrange: pending });
  }
);

export const arrangeIdeasInGridAtom = atom(
  null,
  (get, set, { viewportWidth }: { viewportWidth: number; viewportHeight: number }) => {
    const currentIdeas = get(ideasAtom);
    const CARD_SIZE = 180;
    const CARD_MARGIN = 20;
    const EFFECTIVE_CARD_SIZE = CARD_SIZE + CARD_MARGIN;
    
    const cardsPerRow = Math.floor(viewportWidth / EFFECTIVE_CARD_SIZE);
    
    const arrangedIdeas = currentIdeas.map((idea, index) => {
      const row = Math.floor(index / cardsPerRow);
      const col = index % cardsPerRow;
      
      return {
        ...idea,
        x: col * EFFECTIVE_CARD_SIZE + CARD_MARGIN,
        y: row * EFFECTIVE_CARD_SIZE + CARD_MARGIN,
        zIndex: 1,
      };
    });
    
    set(ideasAtom, arrangedIdeas);
    
    const currentState = get(ideaWallAtom);
    set(ideaWallAtom, { 
      ...currentState, 
      pendingArrange: false,
      panOffset: { x: 0, y: 0 },
      nextZIndex: 2
    });
  }
);

export const updateIdeaAtom = atom(
  null,
  (get, set, updatedIdea: Idea) => {
    const currentIdeas = get(ideasAtom);
    const newIdeas = [
      ...currentIdeas.filter((i) => i.id !== updatedIdea.id),
      { ...updatedIdea },
    ];
    set(ideasAtom, newIdeas);
  }
);

export const updateIdeaPositionAtom = atom(
  null,
  (get, set, { id, x, y }: { id: string; x: number; y: number }) => {
    const currentIdeas = get(ideasAtom);
    const newIdeas = currentIdeas.map((idea) =>
      idea.id === id ? { ...idea, x, y } : idea
    );
    set(ideasAtom, newIdeas);
  }
);

export const updatePanOffsetAtom = atom(
  null,
  (get, set, offset: { x: number; y: number }) => {
    const current = get(ideaWallAtom);
    set(ideaWallAtom, { ...current, panOffset: offset });
  }
);

export const bringCardToFrontAtom = atom(
  null,
  (get, set, cardId: string) => {
    const currentIdeas = get(ideasAtom);
    const currentState = get(ideaWallAtom);
    
    const newIdeas = currentIdeas.map((idea) =>
      idea.id === cardId 
        ? { ...idea, zIndex: currentState.nextZIndex }
        : idea
    );
    
    set(ideasAtom, newIdeas);
    set(ideaWallAtom, { 
      ...currentState, 
      nextZIndex: currentState.nextZIndex + 1 
    });
  }
);

// Message handler registered with the transport
const ideaWallMessageHandler = (
  currentState: IdeaWallState,
  message: any,
  isPresenter: boolean
): IdeaWallState => {
  if (isPresenter && message.name && message.payload) {
    // New idea from participant
    const newIdea = getNewIdea(message.name, message.payload);
    return {
      ...currentState,
      ideas: [...currentState.ideas, newIdea],
    };
  }
  
  // For other message types, return current state
  return currentState;
};

// Register the game with the message handler
registerGame("idea-wall", ideaWallWithStorageAtom, ideaWallMessageHandler);