import { readFileSync } from "node:fs";
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import { get, push, ref, remove, set, update } from "firebase/database";
import { afterAll, beforeAll, beforeEach, describe, it } from "vitest";

const ONE_HOUR = 60 * 60 * 1000;

const PRESENTER_UID = "presenter-uid";
const PLAYER_UID = "player-uid";
const OTHER_UID = "other-uid";

let testEnv: RulesTestEnvironment;

const db = (uid?: string) =>
  (uid
    ? testEnv.authenticatedContext(uid)
    : testEnv.unauthenticatedContext()
  ).database();

const playerRecord = (id: string, uid: string, isPresenter = false) => ({
  id,
  name: id,
  isRegistered: true,
  isPresenter,
  connected: true,
  uid,
});

const seedLobby = async ({ idleFor = 0 }: { idleFor?: number } = {}) => {
  await testEnv.withSecurityRulesDisabled(async (context) => {
    const seed = context.database();
    await set(ref(seed, "lobbies/AAAA"), {
      name: "Test Lobby",
      presenterId: "presenter-1",
      presenterUid: PRESENTER_UID,
      createdAt: Date.now() - idleFor,
      players: {
        "presenter-1": playerRecord("presenter-1", PRESENTER_UID, true),
        "player-1": playerRecord("player-1", PLAYER_UID),
      },
    });
    await set(ref(seed, "lobbyActivity/AAAA"), Date.now() - idleFor);
  });
};

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: "demo-rules",
    database: {
      host: "127.0.0.1",
      port: 9100,
      rules: readFileSync(
        new URL("../database.rules.json", import.meta.url),
        "utf8"
      ),
    },
  });
});

afterAll(async () => {
  await testEnv.cleanup();
});

beforeEach(async () => {
  await testEnv.clearDatabase();
});

describe("reading a lobby", () => {
  it("is allowed for any signed-in user", async () => {
    await seedLobby();
    await assertSucceeds(get(ref(db(PLAYER_UID), "lobbies/AAAA")));
  });

  it("is denied without auth", async () => {
    await seedLobby();
    await assertFails(get(ref(db(), "lobbies/AAAA")));
  });
});

describe("creating a lobby", () => {
  const newLobby = (presenterUid: string) => ({
    name: "New Lobby",
    presenterId: "presenter-2",
    presenterUid,
    createdAt: Date.now(),
    players: { "presenter-2": playerRecord("presenter-2", presenterUid, true) },
  });

  it("is allowed when the creator claims their own uid", async () => {
    await assertSucceeds(set(ref(db(OTHER_UID), "lobbies/BBBB"), newLobby(OTHER_UID)));
  });

  it("is denied when claiming someone else's uid", async () => {
    await assertFails(
      set(ref(db(OTHER_UID), "lobbies/BBBB"), newLobby(PRESENTER_UID))
    );
  });

  it("is denied without auth", async () => {
    await assertFails(set(ref(db(), "lobbies/BBBB"), newLobby(OTHER_UID)));
  });
});

describe("presenter-owned paths", () => {
  beforeEach(seedLobby);

  it("allow the presenter to start a game", async () => {
    await assertSucceeds(
      update(ref(db(PRESENTER_UID), "lobbies/AAAA"), {
        currentGame: { name: "buzzer", startedAt: Date.now() },
        messages: null,
        presenterState: null,
        playerState: null,
      })
    );
  });

  it("deny a player starting a game", async () => {
    await assertFails(
      update(ref(db(PLAYER_UID), "lobbies/AAAA"), {
        currentGame: { name: "buzzer", startedAt: Date.now() },
      })
    );
  });

  it("allow the presenter to publish presenter state", async () => {
    await assertSucceeds(
      set(ref(db(PRESENTER_UID), "lobbies/AAAA/presenterState"), {
        json: "{}",
        cursor: "",
      })
    );
  });

  it("deny a player writing presenter state", async () => {
    await assertFails(
      set(ref(db(PLAYER_UID), "lobbies/AAAA/presenterState"), {
        json: "{}",
        cursor: "",
      })
    );
  });

  it("allow the presenter to message players", async () => {
    await assertSucceeds(
      set(push(ref(db(PRESENTER_UID), "lobbies/AAAA/messages/toPlayers")), {
        json: '"hello"',
      })
    );
  });

  it("deny a player messaging players directly", async () => {
    await assertFails(
      set(push(ref(db(PLAYER_UID), "lobbies/AAAA/messages/toPlayers")), {
        json: '"hello"',
      })
    );
  });

  it("allow the presenter to close the lobby", async () => {
    await assertSucceeds(
      update(ref(db(PRESENTER_UID)), {
        "lobbies/AAAA": null,
        "lobbyActivity/AAAA": null,
      })
    );
  });

  it("deny a player closing an active lobby", async () => {
    await assertFails(remove(ref(db(PLAYER_UID), "lobbies/AAAA")));
  });

  it("deny a player renaming the lobby", async () => {
    await assertFails(set(ref(db(PLAYER_UID), "lobbies/AAAA/name"), "Hijack"));
  });
});

describe("player records", () => {
  beforeEach(seedLobby);

  it("allow a player to join with their own uid", async () => {
    await assertSucceeds(
      set(
        ref(db(OTHER_UID), "lobbies/AAAA/players/player-2"),
        playerRecord("player-2", OTHER_UID)
      )
    );
  });

  it("deny joining with someone else's uid", async () => {
    await assertFails(
      set(
        ref(db(OTHER_UID), "lobbies/AAAA/players/player-2"),
        playerRecord("player-2", PLAYER_UID)
      )
    );
  });

  it("deny overwriting another player's record", async () => {
    await assertFails(
      set(
        ref(db(OTHER_UID), "lobbies/AAAA/players/player-1"),
        playerRecord("player-1", OTHER_UID)
      )
    );
  });

  it("allow a player to update their own presence", async () => {
    await assertSucceeds(
      set(ref(db(PLAYER_UID), "lobbies/AAAA/players/player-1/connected"), false)
    );
  });

  it("deny updating another player's presence", async () => {
    await assertFails(
      set(ref(db(OTHER_UID), "lobbies/AAAA/players/player-1/connected"), false)
    );
  });

  it("allow a player to leave the lobby", async () => {
    await assertSucceeds(
      remove(ref(db(PLAYER_UID), "lobbies/AAAA/players/player-1"))
    );
  });
});

describe("player input paths", () => {
  beforeEach(seedLobby);

  it("allow a player to publish their own state", async () => {
    await assertSucceeds(
      set(ref(db(PLAYER_UID), "lobbies/AAAA/playerState/player-1"), {
        json: "{}",
        cursor: "",
      })
    );
  });

  it("deny publishing another player's state", async () => {
    await assertFails(
      set(ref(db(OTHER_UID), "lobbies/AAAA/playerState/player-1"), {
        json: "{}",
        cursor: "",
      })
    );
  });

  it("allow a player to message the presenter as themselves", async () => {
    await assertSucceeds(
      set(push(ref(db(PLAYER_UID), "lobbies/AAAA/messages/toPresenter")), {
        json: '"down"',
        senderId: "player-1",
        senderName: "player-1",
      })
    );
  });

  it("deny spoofing another player's messages", async () => {
    await assertFails(
      set(push(ref(db(OTHER_UID), "lobbies/AAAA/messages/toPresenter")), {
        json: '"down"',
        senderId: "player-1",
        senderName: "player-1",
      })
    );
  });

  it("deny messaging from outside the lobby", async () => {
    await assertFails(
      set(push(ref(db(OTHER_UID), "lobbies/AAAA/messages/toPresenter")), {
        json: '"down"',
        senderId: "player-2",
        senderName: "player-2",
      })
    );
  });
});

describe("playerLobbies index", () => {
  it("allows a player to store and read their own entry", async () => {
    await assertSucceeds(
      set(ref(db(PLAYER_UID), "playerLobbies/player-1"), {
        code: "AAAA",
        uid: PLAYER_UID,
      })
    );
    await assertSucceeds(get(ref(db(PLAYER_UID), "playerLobbies/player-1")));
  });

  it("allows reading an entry that does not exist yet", async () => {
    await assertSucceeds(get(ref(db(PLAYER_UID), "playerLobbies/unknown")));
  });

  it("denies claiming an entry with someone else's uid", async () => {
    await assertFails(
      set(ref(db(OTHER_UID), "playerLobbies/player-1"), {
        code: "AAAA",
        uid: PLAYER_UID,
      })
    );
  });

  it("denies reading or replacing another player's entry", async () => {
    await set(ref(db(PLAYER_UID), "playerLobbies/player-1"), {
      code: "AAAA",
      uid: PLAYER_UID,
    });
    await assertFails(get(ref(db(OTHER_UID), "playerLobbies/player-1")));
    await assertFails(
      set(ref(db(OTHER_UID), "playerLobbies/player-1"), {
        code: "BBBB",
        uid: OTHER_UID,
      })
    );
  });
});

describe("idle lobby cleanup", () => {
  it("allows anyone to delete a lobby idle for over an hour", async () => {
    await seedLobby({ idleFor: ONE_HOUR + 1000 });
    await assertSucceeds(
      update(ref(db(OTHER_UID)), {
        "lobbies/AAAA": null,
        "lobbyActivity/AAAA": null,
      })
    );
  });

  it("denies taking over a stale lobby in a single write", async () => {
    await seedLobby({ idleFor: ONE_HOUR + 1000 });
    await assertFails(
      set(ref(db(OTHER_UID), "lobbies/AAAA"), {
        name: "Hijacked Lobby",
        presenterId: "attacker-1",
        presenterUid: OTHER_UID,
      })
    );
  });

  it("denies deleting a recently active lobby", async () => {
    await seedLobby({ idleFor: ONE_HOUR / 2 });
    await assertFails(
      update(ref(db(OTHER_UID)), {
        "lobbies/AAAA": null,
        "lobbyActivity/AAAA": null,
      })
    );
  });

  it("allows reading the activity index when signed in", async () => {
    await seedLobby();
    await assertSucceeds(get(ref(db(OTHER_UID), "lobbyActivity")));
    await assertFails(get(ref(db(), "lobbyActivity")));
  });

  it("allows recording activity for a lobby being created", async () => {
    await assertSucceeds(
      set(ref(db(OTHER_UID), "lobbyActivity/BBBB"), Date.now())
    );
  });

  it("allows the presenter to record activity on their lobby", async () => {
    await seedLobby();
    await assertSucceeds(
      set(ref(db(PRESENTER_UID), "lobbyActivity/AAAA"), Date.now())
    );
  });

  it("denies others refreshing activity on an active lobby", async () => {
    await seedLobby();
    await assertFails(
      set(ref(db(OTHER_UID), "lobbyActivity/AAAA"), Date.now())
    );
  });
});
