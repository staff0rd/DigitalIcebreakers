import { ConnectionStatus } from "ConnectionStatus";
import { AnyAction } from "redux";
import { updateConnectionStatus } from "./connection/actions";
import { joinLobby } from "./lobby/actions";
import { LobbyState, SET_LOBBY } from "./lobby/types";
import { RootState } from "./RootState";
import { SignalRMiddleware } from "./SignalRMiddleware";
import { UserState } from "./user/types";
import { describe, it, expect, vi, beforeEach } from "vitest";

const connectionFactory = vi.fn();
const mockConnection = {
  on: vi.fn(),
  onclose: vi.fn(),
  emit: (eventName: string, payload: any) => {
    const callback = mockConnection.on.mock.calls.find(
      (call) => call[0] === eventName
    );
    callback && callback[1](payload);
  },
};
const dispatch = vi.fn();

const createMiddleware = (state: Partial<RootState> = {}) => {
  const store = {
    getState: vi.fn(() => state as RootState),
    dispatch,
  };
  const next = vi.fn();

  const invoke = (action) =>
    SignalRMiddleware(connectionFactory)(store)(next)(action);

  return { store, next, invoke };
};

describe("SignalRMiddleware", () => {
  beforeEach(() => {
    connectionFactory.mockClear();
    mockConnection.on.mockClear();
    mockConnection.onclose.mockClear();
    dispatch.mockClear();
    connectionFactory.mockReturnValue(mockConnection);
  });
  describe("when joining a lobby", () => {
    describe("when not yet registered", () => {
      describe("when player", () => {
        it("should not set lobby", () => {
          const { invoke } = createMiddleware({
            user: { isRegistered: false } as UserState,
            lobby: { joiningLobbyId: "new-lobby" } as LobbyState,
            connection: { status: ConnectionStatus.Connected },
          });
          invoke({} as AnyAction);
          mockConnection.emit("reconnect", {
            lobbyId: "new-lobby",
          });
          expect(dispatch).not.toBeCalledWith(
            expect.objectContaining({
              type: SET_LOBBY,
            })
          );
        });
      });
      describe("when presenter", () => {
        it("should set lobby", () => {
          const { invoke } = createMiddleware({
            user: { isRegistered: false } as UserState,
            lobby: {
              joiningLobbyId: "new-lobby",
              isPresenter: true,
            } as LobbyState,
            connection: { status: ConnectionStatus.Connected },
          });
          invoke({} as AnyAction);
          mockConnection.emit("reconnect", {
            lobbyId: "new-lobby",
          });
          expect(dispatch).toBeCalledWith(
            expect.objectContaining({
              type: SET_LOBBY,
            })
          );
        });
      });
    });
  });

  describe("when connected to an old lobby", () => {
    it("should not update to old lobby", () => {
      const { invoke } = createMiddleware({
        user: {} as UserState,
        lobby: { joiningLobbyId: "new-lobby" } as LobbyState,
        connection: { status: ConnectionStatus.Connected },
      });
      invoke({} as AnyAction);
      mockConnection.emit("reconnect", {
        lobbyId: "old-lobby",
      });
      expect(dispatch).not.toBeCalledWith(
        expect.objectContaining({
          type: SET_LOBBY,
        })
      );
    });
  });
  describe("when connection achieved", () => {
    describe("when is joining lobby", () => {
      it("should join lobby", () => {
        const { invoke } = createMiddleware({
          lobby: { joiningLobbyId: "some-lobby" } as LobbyState,
          connection: { status: ConnectionStatus.Connected },
        });
        invoke(updateConnectionStatus(ConnectionStatus.Connected));
        expect(dispatch).toHaveBeenCalledWith(joinLobby("some-lobby"));
      });
    });
  });
});
