import { configureAppStore } from "@store/configureAppStore";
import * as lobbyActions from "@store/lobby/actions";
import * as userActions from "@store/user/actions";
import waitFor from "wait-for-expect";
import { getLobbyMembership } from "./firebase/database";

describe("realTimeMiddleware", () => {
  const authenticate = async (store = configureAppStore().store) => {
    await store.dispatch(userActions.authenticate());
    await waitFor(() => {
      expect(store.getState().user.id).not.toBe("");
    });
    return store;
  };

  const createLobby = async (
    store: Awaited<ReturnType<typeof authenticate>>
  ) => {
    store.dispatch(lobbyActions.createLobby("my lobby"));
    await waitFor(() => {
      expect(store.getState().lobby.name).toBe("my lobby");
    });
    return store;
  };

  it("should authenticate", async () => {
    await authenticate();
  });

  it("should create lobby", async () => {
    const store = await authenticate();
    await createLobby(store);
  });

  describe("getLobbyMembership", () => {
    it("should get lobby membership", async () => {
      const store = await authenticate();
      await createLobby(store);

      const result = await getLobbyMembership(store.getState().user.id);

      expect(result).toBe(store.getState().lobby.id);
    });

    it("should not allow anyone else to read", async () => {
      let { store, auth } = configureAppStore();

      await authenticate(store);
      await createLobby(store);

      await auth.signOut();
      await authenticate();

      await expect(
        getLobbyMembership(store.getState().user.id)
      ).rejects.toThrowError("Permission denied");
    });
  });
});
