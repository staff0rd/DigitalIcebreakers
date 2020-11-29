import { PollPlayerState } from "./PollPlayerState";
import { PollPresenterState } from "./PollPresenterState";

export interface PollState {
    player: PollPlayerState;
    presenter: PollPresenterState;
}
