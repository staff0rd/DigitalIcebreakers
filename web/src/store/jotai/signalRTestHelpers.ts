import { act } from "@testing-library/react";
import { createStore } from "jotai";
import { vi } from "vitest";
import { initializeSignalR } from "./signalRAtoms";

type JotaiStore = ReturnType<typeof createStore>;

export const createMockConnection = () => ({
  on: vi.fn((..._args: unknown[]) => undefined),
  off: vi.fn(),
  onclose: vi.fn(),
  start: vi.fn(() => Promise.resolve()),
  invoke: vi.fn((..._args: unknown[]) => Promise.resolve()),
});

export type MockConnection = ReturnType<typeof createMockConnection>;

export const initializeMockSignalR = (jotaiStore: JotaiStore) => {
  const connection = createMockConnection();
  initializeSignalR(jotaiStore, () => connection as never);

  const emit = (eventName: string, payload?: unknown) => {
    const calls = connection.on.mock.calls.filter(
      (call) => call[0] === eventName
    );
    const handler = calls[calls.length - 1]?.[1] as
      | ((payload?: unknown) => void)
      | undefined;
    act(() => handler?.(payload));
  };

  const sentGameMessages = (key: "client" | "admin") =>
    connection.invoke.mock.calls
      .filter(([method]) => method === "hubMessage")
      .map(([, payload]) => JSON.parse(payload as string))
      .filter((message) => key in message)
      .map((message) => message[key]);

  return {
    connection,
    emit,
    sentClientMessages: () => sentGameMessages("client"),
    sentPresenterMessages: () => sentGameMessages("admin"),
  };
};
