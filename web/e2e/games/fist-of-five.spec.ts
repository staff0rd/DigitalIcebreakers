import { test, expect } from "../fixtures/firebase";

test.describe("Fist of Five Tests", () => {
  test("Average score is calculated", async ({ presenter, browser, browserFactory }) => {
    await presenter.startFistOfFive();
    await presenter.page.getByTestId("show-responses").click();

    // Create two players
    const players = await browserFactory.createPlayers(browser, presenter.url, 2);

    await players[0].page.getByRole("button", { name: "1" }).click();
    await players[0].page.getByRole("button", { name: "Lock In & Send" }).click();
    await players[1].page.getByRole("button", { name: "5" }).click();
    await players[1].page.getByRole("button", { name: "Lock In & Send" }).click();

    // Retrying assertion: the element renders before the votes land, so a
    // one-shot read can see a stale average while votes are still in flight
    await expect(presenter.page.getByTestId("average-score")).toHaveText("3");
  });
});