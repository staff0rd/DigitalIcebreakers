import { test, expect } from "../../fixtures/firebase";

test.describe("Given Trivia When editing questions", () => {
  test.beforeEach(async ({ presenter }) => {
    await presenter.startTrivia();
  });

  test("Can add question", async ({ presenter }) => {
    await presenter.page.getByRole("link", { name: "Questions" }).click();
    await presenter.page.getByRole("button", { name: "Add question" }).click();
    await presenter.page.getByRole("button", { name: "Save" }).click();

    await expect(
      presenter.page.locator("#questions-table tr")
      // header row + 1 for the new question
    ).toHaveCount(2);
  });
});
