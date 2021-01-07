import { ConnectionStatus } from "ConnectionStatus";
import { ReconnectPayload } from "./connection/types";
import { RootState } from "./RootState";
import { onReconnect } from "./SignalRMiddleware";

describe("onReconnect", () => {
  describe("when joining lobby", () => {
    it("should allow case insensitive join code", () => {
      const dispatch = jest.fn();
      onReconnect(
        () =>
          ({
            connection: { status: ConnectionStatus.Connected },
            lobby: {
              joiningLobbyId: "aaaa",
            },
            user: {
              isRegistered: true,
            },
          } as RootState),
        dispatch
      )({ lobbyId: "AAAA" } as ReconnectPayload);
      const setLobbyAction = dispatch.mock.calls.find(
        (call) => call[0].type === "SET_LOBBY"
      );
      expect(setLobbyAction).not.toBeUndefined();
      expect(setLobbyAction[0].id).toBe("AAAA");
    });
  });
});
