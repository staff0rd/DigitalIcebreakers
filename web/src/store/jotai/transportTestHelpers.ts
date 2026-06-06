import { createStore } from "jotai";
import { initializeTransport } from "./transportAtoms";
import {
  createMockTransport,
  MockTransport,
} from "../transport/mockTransport";

type JotaiStore = ReturnType<typeof createStore>;

export type { MockTransport };

export const initializeMockTransport = (jotaiStore: JotaiStore) => {
  const transport = createMockTransport();
  initializeTransport(jotaiStore, transport);

  const sentGameMessages = (
    send:
      | MockTransport["sendClientMessage"]
      | MockTransport["sendPresenterMessage"]
  ) => send.mock.calls.map(([message]: [unknown]) => message);

  return {
    transport,
    emit: transport.emit,
    sentClientMessages: () => sentGameMessages(transport.sendClientMessage),
    sentPresenterMessages: () =>
      sentGameMessages(transport.sendPresenterMessage),
  };
};
