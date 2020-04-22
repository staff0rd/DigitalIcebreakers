import { createGameAction, createReceiveGameMessageReducer, createGameActionWithPayload } from "../../store/actionHelpers";
import { Idea } from "./Idea";
import { ServerIdea } from "./ServerIdea";
import { guid } from "../../util/guid";
import Random from "../../Random";
import { Colors } from "../../Colors";
import StorageManager from '../../store/StorageManager';

const IDEA_COLORS = [
    Colors.Amber.A200,
    Colors.Green.A200,
    Colors.LightGreen.A200,
    Colors.LightBlue.A200,
    Colors.DeepPurple.A100,
    Colors.Red.A100
];

export const Name = "ideawall";

export const loadIdeasAction = createGameAction(Name, "presenter", "load-ideas");
export const clearIdeasAction = createGameAction(Name, "presenter", "clear-ideas");
export const arrangeIdeasAction = createGameActionWithPayload<boolean>(Name, "presenter", "arrange-ideas");
export const toggleNamesAction = createGameAction(Name, "presenter", "toggle-names");
export const ideaUpdatedAction = createGameActionWithPayload<Idea>(Name, "presenter", "idea-updated");


export interface IdeaWallState {
    dynamicSize: boolean,
    storageKey: string,
    showNames: boolean,
    ideas: Idea[],
    pendingArrange: boolean,
}

const getNewIdea = (playerName: string, idea: string | ServerIdea) : Idea =>  {
    let content = (idea as ServerIdea).content || idea as string;
    let lane = (idea as ServerIdea).lane || 0;
    return {id: guid(), playerName: playerName, idea: content, lane: lane, color: Random.pick(IDEA_COLORS), x: undefined, y: undefined};
}

// getIdeas() {
    
//     return this.getFromStorage(this.props.storageKey);
// }

const storage = new StorageManager(window.localStorage);

export const ideaWallReducer = createReceiveGameMessageReducer<string, IdeaWallState>(
    Name,
    { 
        dynamicSize: false,
        storageKey: "ideawall:ideas",
        showNames: false,
        ideas: [],
        pendingArrange: false,
     }, 
    (state, { payload: { name, payload} }) => ({
        ...state,
        ideas: [...state.ideas, getNewIdea(name, payload)],
    }),
    "presenter",
    (builder) => {
        builder.addCase(toggleNamesAction, (state, action) => ({
            ...state,
            showNames: !state.showNames,
        }));
        builder.addCase(clearIdeasAction, (state) => { 
            storage.clearStorage(state.storageKey);
            return {
                ...state,
                ideas: [],
            }
        });
        builder.addCase(loadIdeasAction, (state) => {
            const ideas = storage.getFromStorage<Idea[]>(state.storageKey) || [];
            return {
                ...state,
                ideas: ideas,
            }
        });
        builder.addCase(ideaUpdatedAction, (state, { payload: idea }) => {
            const ideas = [...state.ideas.filter(i => i.id != idea.id), { ...idea }];
            storage.saveToStorage(state.storageKey, ideas);
            return {
                ...state,
                ideas,
            }
        });
        builder.addCase(arrangeIdeasAction, (state, action) => ({
            ...state,
            pendingArrange: action.payload,
        }))
    }
);


