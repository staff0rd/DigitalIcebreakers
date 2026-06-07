import { test, expect } from "../fixtures/firebase";

test.describe("NamePicker Tests", () => {
  test("One player is selected from multiple players", async ({
    browser,
    presenter,
    browserFactory,
  }) => {
    await presenter.page.evaluate(() => {
      (globalThis as any).__NAME_PICKER_FADE_SECONDS__ = 0.5;
    });

    await presenter.startNamePicker();

    const player1 = await browserFactory.createPlayer(
      browser,
      presenter.url,
      "player1"
    );
    const player2 = await browserFactory.createPlayer(
      browser,
      presenter.url,
      "player2"
    );
    const player3 = await browserFactory.createPlayer(
      browser,
      presenter.url,
      "player3"
    );

    const namesBeforePick = await presenter.page.getAttribute(
      "[data-names]",
      "data-names"
    );
    const namesList = namesBeforePick?.split(",") || [];
    expect(namesList).toHaveLength(3);

    await presenter.page.getByRole("button", { name: "Pick" }).click();

    await presenter.page.waitForTimeout(700);

    const selectedName = await presenter.page.getAttribute(
      "[data-selected-name]",
      "data-selected-name"
    );
    expect(selectedName).toBeTruthy();
    expect(namesList).toContain(selectedName);

    const players = [player1, player2, player3];
    let winnerCount = 0;
    let loserCount = 0;

    for (const player of players) {
      const playerName = await player.page.locator("h1").textContent();
      const resultText = await player.page.locator("h2").textContent();

      if (playerName === selectedName) {
        expect(resultText).toBe("You won!");
        winnerCount++;
      } else {
        expect(resultText).toBe("You lost :(");
        loserCount++;
      }
    }

    expect(winnerCount).toBe(1);
    expect(loserCount).toBe(2);
  });
});
