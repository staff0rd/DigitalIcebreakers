import { test, expect } from "../../fixtures/firebase";

test.describe("Given Trivia When clicking scores", () => {
  test("Then scoreboard is displayed", async ({
    browser,
    presenter,
    browserFactory,
  }) => {
    await presenter.loadTriviaQuestions();

    const players = await browserFactory.createPlayers(
      browser,
      presenter.url,
      2
    );

    // Player 1 selects correct answer
    await players[0].page.getByRole("button", { name: "correct" }).click();
    await players[0].page
      .getByRole("button", { name: "Lock In & Send" })
      .click();

    // Player 2 selects wrong answer
    await players[1].page.getByRole("button", { name: "wrong1" }).click();
    await players[1].page
      .getByRole("button", { name: "Lock In & Send" })
      .click();

    // Show scoreboard
    await presenter.page.getByTestId("show-scoreboard").click();

    // Verify scoreboard
    const names = presenter.page.locator(".scoreboard-name");
    const scores = presenter.page.locator(".scoreboard-score");

    await expect(names).toHaveCount(2);
    await expect(scores).toHaveCount(2);

    await expect(names.nth(0)).toHaveText("Player 1");
    await expect(names.nth(1)).toHaveText("Player 2");
    await expect(scores.nth(0)).toHaveText("1");
    await expect(scores.nth(1)).toHaveText("0");
  });
});
