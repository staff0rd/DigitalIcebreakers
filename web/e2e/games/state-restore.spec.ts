import { test, expect } from "../fixtures/base";

test.describe("Game state over Firebase", () => {
  test("presenter refresh restores aggregated votes", async ({
    presenter,
    player,
  }) => {
    await presenter.startYesNoMaybe();
    await player.page.waitForSelector('button:has-text("Yes")');

    await player.page.getByRole("button", { name: "Yes" }).click();
    await expect(
      presenter.page.getByTestId("yes-no-maybe-presenter")
    ).toHaveAttribute("data-yes", "1");

    await presenter.page.reload();

    await expect(
      presenter.page.getByTestId("yes-no-maybe-presenter")
    ).toHaveAttribute("data-yes", "1");
  });

  test("late joiner sees the current broadcast text", async ({
    presenter,
    browser,
    browserFactory,
  }) => {
    await presenter.startBroadcast();
    await presenter.page.getByRole("textbox").fill("hello");

    const lateJoiner = await browserFactory.createPlayer(
      browser,
      presenter.url,
      "late-joiner"
    );

    await expect(lateJoiner.page.getByTestId("client-text")).toHaveText(
      "hello"
    );
  });
});
