import { test, expect } from "../../fixtures/base";

test.describe("Given Trivia When editing questions", () => {
  test.beforeEach(async ({ presenter }) => {
    await presenter.startTrivia();
  });

  test("Can add question", async ({ presenter }) => {
    await presenter.page.getByRole("link", { name: "Questions" }).click();
    await presenter.page.getByRole("button", { name: "Add question" }).click();
    await presenter.page.getByRole("button", { name: "Save" }).click();

    const rows = await presenter.page.locator("#questions-table tr").count();
    expect(rows).toBe(2); // Header row + 1 question
  });
});
