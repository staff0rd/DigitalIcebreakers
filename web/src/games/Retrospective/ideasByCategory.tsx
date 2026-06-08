import { GameMessage } from "games/GameMessage";
import { PayloadFromParticipant } from "./retrospectiveAtoms";

export const ideasByCategory = (
  ideas: GameMessage<PayloadFromParticipant>[],
  category: number
) => ideas.filter((idea) => idea.payload.category === category);
