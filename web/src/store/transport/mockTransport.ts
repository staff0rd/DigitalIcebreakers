import { act } from "@testing-library/react";
import { vi } from "vitest";
import { Transport } from "./Transport";

export type MockTransport = {
  [K in keyof Transport]: ReturnType<typeof vi.fn>;
} & {
  emit: (eventName: string, payload?: unknown) => void;
};

export const createMockTransport = (): MockTransport => {
  const transport = {
    start: vi.fn(() => Promise.resolve()),
    connect: vi.fn(() => Promise.resolve()),
    createLobby: vi.fn(() => Promise.resolve()),
    connectToLobby: vi.fn(() => Promise.resolve()),
    closeLobby: vi.fn(() => Promise.resolve()),
    newGame: vi.fn(() => Promise.resolve()),
    sendPresenterMessage: vi.fn(() => Promise.resolve()),
    sendClientMessage: vi.fn(() => Promise.resolve()),
    on: vi.fn(),
    off: vi.fn(),
    emit: (eventName: string, payload?: unknown) => {
      const calls = transport.on.mock.calls.filter(
        (call) => call[0] === eventName
      );
      const handler = calls[calls.length - 1]?.[1];
      act(() => handler?.(payload));
    },
  };
  return transport as MockTransport;
};
