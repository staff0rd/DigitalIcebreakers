import { test, expect } from "../fixtures/base";

test.describe("Given two lobbys When a player switches", () => {
  test("Then should be connected to second lobby", async ({
    browser,
    browserFactory,
    presenter,
    player,
  }) => {
    // Start broadcast on first presenter
    await presenter.startBroadcast();
    await presenter.page.getByRole("textbox").fill("presenter1");

    // Create second presenter and start broadcast game
    const presenter2 = await browserFactory.createPresenter(browser);
    await presenter2.startBroadcast();
    const textBox = presenter2.page.getByRole("textbox");
    await textBox.fill("presenter2");

    // Switch player to second lobby - just navigate since player has a name stored
    await browserFactory.joinLobby(presenter2.url, player.page);

    const text = await player.page.getByTestId("client-text").textContent();
    expect(text).toBe("presenter2");
  });
});
