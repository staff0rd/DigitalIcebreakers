import { test, expect } from "../fixtures/base";

test.describe("Given a lobby When players join", () => {
  test("Then lobby count should update on presenter", async ({
    presenter,
    player,
  }) => {
    // Ensure player is created (fixture dependency)
    expect(player).toBeDefined();
    
    const presenterLobbyLink = presenter.page.getByTestId("menu-lobby").first();
    await expect(presenterLobbyLink).toHaveText("Lobby (1)");
  });

  test("Then lobby count should update on player", async ({
    presenter,
    player,
  }) => {
    // Ensure presenter is created (fixture dependency)
    expect(presenter).toBeDefined();
    
    const playerLobbyLink = player.page.getByTestId("menu-lobby").first();
    await expect(playerLobbyLink).toHaveText("Lobby (1)");
  });
});
