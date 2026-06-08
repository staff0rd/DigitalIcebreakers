import { test, expect } from "../fixtures/base";

test.describe("YesNoMaybe Tests", () => {
  test("Vote counts update when players vote", async ({
    presenter,
    player,
  }) => {
    await presenter.startYesNoMaybe();
    await player.page.waitForSelector('button:has-text("Yes")');

    const presenterView = presenter.page.getByTestId("yes-no-maybe-presenter");

    await player.page.getByRole("button", { name: "Yes" }).click();

    await expect(presenterView).toHaveAttribute("data-yes", "1");
    await expect(presenterView).toHaveAttribute("data-no", "0");

    await player.page.getByRole("button", { name: "No" }).click();

    await expect(presenterView).toHaveAttribute("data-yes", "0");
    await expect(presenterView).toHaveAttribute("data-no", "1");
  });

  test("Reset button clears all votes", async ({ presenter, player }) => {
    await presenter.startYesNoMaybe();
    await player.page.waitForSelector('button:has-text("Yes")');

    const presenterView = presenter.page.getByTestId("yes-no-maybe-presenter");

    await player.page.getByRole("button", { name: "Yes" }).click();
    await expect(presenterView).toHaveAttribute("data-yes", "1");

    await presenter.page.getByRole("button", { name: "Reset" }).click();

    await expect(presenterView).toHaveAttribute("data-yes", "0");
    await expect(presenterView).toHaveAttribute("data-no", "0");
    await expect(presenterView).toHaveAttribute("data-maybe", "1");
  });
});
