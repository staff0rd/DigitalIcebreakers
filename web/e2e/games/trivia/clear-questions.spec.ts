import { test, expect } from "../../fixtures/base";

test.describe("Given Trivia When clearing questions", () => {
  test.beforeEach(async ({ presenter }) => {
    await presenter.loadTriviaQuestions();
  });

  test("Should clear questions", async ({ presenter }) => {
    await presenter.page.getByRole("link", { name: "Questions" }).click();
    await presenter.page
      .getByRole("button", { name: "Clear all questions" })
      .click();
    await presenter.page.getByRole("button", { name: "Ok" }).click();

    const rows = await presenter.page.locator("#questions-table tr").count();
    expect(rows).toBe(1); // Only header row remains
  });
});
