import { atom } from "jotai";
import { ConnectionStatus } from "../../ConnectionStatus";

export const connectionStatusAtom = atom<ConnectionStatus>(
  ConnectionStatus.NotConnected
);
