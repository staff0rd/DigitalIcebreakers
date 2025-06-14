import { test, expect } from "./fixtures/base";

test.describe("Join Code Test", () => {
  test("Should be connected to lobby", async ({
    browser,
    browserFactory,
    presenter,
  }) => {
    // Get join code from presenter
    const joinCode = await presenter.page.getByTestId("lobby-id").textContent();

    expect(joinCode).toBeTruthy();

    // Create player using join code
    const player = await browserFactory.createPlayerByJoinCode(
      browser,
      joinCode!
    );

    // Verify player is connected to the same lobby
    const playerLobbyId = await player.page.getByTestId(
      "lobby-id"
    ).textContent();
    expect(playerLobbyId).toBe(joinCode);
  });
});
