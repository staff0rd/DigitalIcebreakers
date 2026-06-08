import { test, expect } from "../fixtures/base";

test.describe("Doggos vs Kittehs", () => {
  test("players can vote for doggos or kittehs and presenter sees results", async ({
    presenter,
    player,
    browser,
    browserFactory,
  }) => {
    test.setTimeout(30000);
    // Start the doggos-vs-kittehs game
    await presenter.page.getByRole("link", { name: "New Activity" }).click();
    await presenter.page.getByTestId("game-doggos-vs-kittehs").click();

    // Create additional players
    const player2 = await browserFactory.createPlayer(
      browser,
      presenter.url,
      "Player 2"
    );
    const player3 = await browserFactory.createPlayer(
      browser,
      presenter.url,
      "Player 3"
    );

    // Player 1 votes for kittehs (choice "1") to trigger initial state
    await player.page.getByRole("button", { name: /kitteh/i }).click();

    // Wait for update
    await expect(
      presenter.page.getByTestId("doggos-vs-kittehs-presenter")
    ).toHaveAttribute("data-kittehs", "1");
    await expect(
      presenter.page.getByTestId("doggos-vs-kittehs-presenter")
    ).toHaveAttribute("data-undecided", "2");

    // Player 2 votes for doggos (choice "0")
    await player2.page.getByRole("button", { name: /doggo/i }).click();

    // Wait for update
    await expect(
      presenter.page.getByTestId("doggos-vs-kittehs-presenter")
    ).toHaveAttribute("data-doggos", "1");
    await expect(
      presenter.page.getByTestId("doggos-vs-kittehs-presenter")
    ).toHaveAttribute("data-kittehs", "1");
    await expect(
      presenter.page.getByTestId("doggos-vs-kittehs-presenter")
    ).toHaveAttribute("data-undecided", "1");

    // Player 3 votes for doggos (choice "0")
    await player3.page.getByRole("button", { name: /doggo/i }).click();

    // Final state
    await expect(
      presenter.page.getByTestId("doggos-vs-kittehs-presenter")
    ).toHaveAttribute("data-doggos", "2");
    await expect(
      presenter.page.getByTestId("doggos-vs-kittehs-presenter")
    ).toHaveAttribute("data-kittehs", "1");
    await expect(
      presenter.page.getByTestId("doggos-vs-kittehs-presenter")
    ).toHaveAttribute("data-undecided", "0");

    // Test that players can change their vote
    await player.page.getByRole("button", { name: /doggo/i }).click();

    await expect(
      presenter.page.getByTestId("doggos-vs-kittehs-presenter")
    ).toHaveAttribute("data-doggos", "3");
    await expect(
      presenter.page.getByTestId("doggos-vs-kittehs-presenter")
    ).toHaveAttribute("data-kittehs", "0");
  });
});
