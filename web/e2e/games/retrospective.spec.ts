import { test, expect } from "../fixtures/firebase";

test.describe("Retrospective Tests", () => {
  test("Custom section can have ideas", async ({ presenter, player }) => {
    await presenter.startRetrospective();

    // Set up custom categories
    await presenter.page
      .getByRole("button", { name: "Set categories" })
      .click();
    await presenter.page.getByRole("button", { name: "Ok" }).click();

    // Clear existing text and add custom categories
    const customCategoriesInput = presenter.page.locator("#custom-categories");
    await customCategoriesInput.focus();
    await presenter.page.keyboard.down("Shift");
    await presenter.page.keyboard.press("End");
    await presenter.page.keyboard.press("Backspace");
    await customCategoriesInput.fill("one\ntwo\nthree");
    await presenter.page.getByTestId("select-custom").click();

    // Player adds an idea to category 'three'
    await player.page.locator("#idea-value").fill("my idea");
    await player.page.getByText("three").click();

    // Verify idea appears on presenter's screen
    const ideaElement = presenter.page.getByText("my idea");
    await expect(ideaElement).toBeVisible();
  });

  test("Ideas persist after presenter refresh", async ({
    presenter,
    player,
  }) => {
    await presenter.startRetrospective();

    // Select the Start/Stop/Continue preset
    await presenter.page
      .getByRole("button", { name: "Select" })
      .first()
      .click();

    // Player adds an idea to category 'Start'
    await player.page.locator("#idea-value").fill("persistent idea");
    await player.page.getByRole("button", { name: "Start" }).click();

    await expect(presenter.page.getByText("persistent idea")).toBeVisible();

    await presenter.page.reload();

    // Categories and ideas should be restored from localStorage
    await expect(
      presenter.page.getByRole("heading", { name: "Start" })
    ).toBeVisible();
    await expect(presenter.page.getByText("persistent idea")).toBeVisible();
  });
});
