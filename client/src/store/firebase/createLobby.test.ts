import { createLobby } from "@store/lobby/actions";
import { createMiddleware } from "@store/testHelpers";
import { AUTHENTICATE } from "@store/user/types";
import { getLobbyMembership } from "./createLobby";
import { initialise } from "./initialise";

describe("createLobby", () => {
  beforeAll(() => {
    initialise();
  });

  it("should authenticate", async () => {
    const { invoke, store } = createMiddleware();
    await invoke({ type: AUTHENTICATE });

    expect(store.getState().user.id).not.toBeUndefined();
  });

  it("should create lobby", async () => {
    const { invoke } = createMiddleware();
    await invoke({ type: AUTHENTICATE });
    await invoke(createLobby("my lobby name"));
  });

  it("should get lobby membership", async () => {
    const { invoke, store } = createMiddleware();
    await invoke({ type: AUTHENTICATE });
    await invoke(createLobby("my lobby"));

    const result = await getLobbyMembership(store.getState().user.id);

    expect(result).toBe(store.getState().lobby.id);
  });

  it("should not allow anyione else to read", () => {});
});
