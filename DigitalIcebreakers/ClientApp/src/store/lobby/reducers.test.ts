import { lobbyReducer } from "./reducers";
import { joinLobby, setLobby } from "./actions";
import { LobbyState } from "./types";

describe("lobbyReducer", () => {
  describe("when joining", () => {
    it("should set joiningId", () => {
      const result = lobbyReducer({} as LobbyState, joinLobby("id"));
      expect(result.joiningLobbyId).toBe("id");
    });
  });
  describe("when setting", () => {
    it("should clear joiningId", () => {
      const result = lobbyReducer(
        { joiningLobbyId: "joining-id" } as LobbyState,
        setLobby("new-id", "my lobby", false, [], undefined)
      );
      expect(result.joiningLobbyId).toBeUndefined();
    });
  });
});
