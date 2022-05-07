import { ConnectionStatus } from "@src/ConnectionStatus";
import { AnyAction } from "redux";
import { updateConnectionStatus } from "./connection/actions";
import { joinLobby } from "./lobby/actions";
import { LobbyState, SET_LOBBY } from "./lobby/types";
import { RootState } from "./RootState";
import { RealTimeMiddleware } from "./RealTimeMiddleware";
import { UserState } from "./user/types";

const connectionFactory = jest.fn();
const mockConnection = {
  on: jest.fn(),
  onclose: jest.fn(),
  emit: (eventName: string, payload: any) => {
    const callback = mockConnection.on.mock.calls.find(
      (call) => call[0] === eventName
    );
    callback && callback[1](payload);
  },
};
const dispatch = jest.fn();

const createMiddleware = (state: Partial<RootState> = {}) => {
  const store = {
    getState: jest.fn(() => state as RootState),
    dispatch,
  };
  const next = jest.fn();

  const invoke = (action: AnyAction) =>
    RealTimeMiddleware()(store)(next)(action);

  return { store, next, invoke };
};

describe("SignalRMiddleware", () => {
  beforeEach(() => {
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
