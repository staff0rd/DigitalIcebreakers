import { ConnectionStatus } from "ConnectionStatus";
import { AnyAction } from "redux";
import { updateConnectionStatus } from "./connection/actions";
import { joinLobby } from "./lobby/actions";
import { LobbyState, SET_LOBBY } from "./lobby/types";
import { RootState } from "./RootState";
import { SignalRMiddleware } from "./SignalRMiddleware";
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
    SignalRMiddleware(connectionFactory)(store)(next)(action);

  return { store, next, invoke };
};

describe("SignalRMiddleware", () => {
  beforeEach(() => {
    connectionFactory.mockReturnValue(mockConnection);
  });
  describe("when connected to an existing lobby", () => {
    describe("when joining a different lobby", () => {
      it("should not update to existing lobby", () => {
        const { invoke } = createMiddleware({
          user: {} as UserState,
          lobby: { joiningLobbyId: "different-lobby" } as LobbyState,
        });
        invoke({} as AnyAction);
        mockConnection.emit("reconnect", {
          id: "existing-lobby",
        });
        expect(dispatch).not.toBeCalledWith(
          expect.objectContaining({
            type: SET_LOBBY,
          })
        );
      });
    });
  });

  describe("when connection achieved", () => {
    describe("when is joining lobby", () => {
      it("should join lobby", () => {
        const { invoke } = createMiddleware({
          lobby: { joiningLobbyId: "some-lobby" } as LobbyState,
        });
        invoke(updateConnectionStatus(ConnectionStatus.Connected));
        expect(dispatch).toHaveBeenCalledWith(joinLobby("some-lobby"));
      });
    });
  });
});
