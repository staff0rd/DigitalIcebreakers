import { test, expect } from "../fixtures/base";

test.describe("IdeaWall Tests", () => {
  test("Ideas are collected and displayed", async ({ presenter, browser, browserFactory }) => {
    await presenter.startIdeaWall();
    
    // Create two players
    const players = await browserFactory.createPlayers(browser, presenter.url, 2);
    
    // Player 1 submits an idea
    await players[0].page.getByRole("textbox").fill("Test idea 1");
    await players[0].page.getByRole("button", { name: "Send" }).click();
    
    // Player 2 submits an idea
    await players[1].page.getByRole("textbox").fill("Test idea 2");
    await players[1].page.getByRole("button", { name: "Send" }).click();
    
    // Ideas should be visible on presenter view as text content
    await expect(presenter.page.getByText("Test idea 1")).toBeVisible();
    await expect(presenter.page.getByText("Test idea 2")).toBeVisible();
  });
  
  test("Ideas persist after presenter refresh", async ({ presenter, browser, browserFactory }) => {
    await presenter.startIdeaWall();
    
    // Create player and submit idea
    const player = await browserFactory.createPlayer(browser, presenter.url);
    await player.page.getByRole("textbox").fill("Persistent idea");
    await player.page.getByRole("button", { name: "Send" }).click();
    
    // Verify idea is visible
    await expect(presenter.page.getByText("Persistent idea")).toBeVisible();
    
    // Refresh presenter page
    await presenter.page.reload();
    
    // Ideas should still be visible after refresh
    await expect(presenter.page.getByText("Persistent idea")).toBeVisible();
  });
  
  test("Ideas display correctly", async ({ presenter, browser, browserFactory }) => {
    await presenter.startIdeaWall();
    
    // Verify initial state
    await expect(presenter.page.getByText("Waiting on ideas...")).toBeVisible();
    
    // Create player and submit idea
    const player = await browserFactory.createPlayer(browser, presenter.url);
    await player.page.getByRole("textbox").fill("Test idea");
    await player.page.getByRole("button", { name: "Send" }).click();
    
    // Verify idea is visible and waiting message is gone
    await expect(presenter.page.getByText("Test idea")).toBeVisible();
    await expect(presenter.page.getByText("Waiting on ideas...")).not.toBeVisible();
  });
  
  test("Toggle names functionality works", async ({ presenter, browser, browserFactory }) => {
    await presenter.startIdeaWall();
    
    // Create player and submit idea
    const player = await browserFactory.createPlayer(browser, presenter.url, "Test Player");
    await player.page.getByRole("textbox").fill("Named idea");
    await player.page.getByRole("button", { name: "Send" }).click();
    
    // Player name should initially be hidden
    await expect(presenter.page.getByText("Test Player")).not.toBeVisible();
    
    await presenter.page.getByRole("button", { name: "Toggle Names" }).click();
    
    // Player name should now be visible
    await expect(presenter.page.getByText("Test Player")).toBeVisible();
    
    // Toggle names off
    await presenter.page.getByRole("button", { name: "Toggle Names" }).click();
    
    // Player name should be hidden again
    await expect(presenter.page.getByText("Test Player")).not.toBeVisible();
  });
  
  test("Clear ideas functionality works", async ({ presenter, browser, browserFactory }) => {
    await presenter.startIdeaWall();
    
    // Create player and submit idea
    const player = await browserFactory.createPlayer(browser, presenter.url);
    await player.page.getByRole("textbox").fill("Idea to clear");
    await player.page.getByRole("button", { name: "Send" }).click();
    
    // Verify idea is visible
    await expect(presenter.page.getByText("Idea to clear")).toBeVisible();
    
    await presenter.page.getByRole("button", { name: "Clear" }).click();
    
    // Wait for confirm dialog to appear and click it
    await presenter.page.getByRole("button", { name: "Ok" }).click();
    
    // Ideas should be gone and waiting message should be back
    await expect(presenter.page.getByText("Idea to clear")).not.toBeVisible();
    await expect(presenter.page.getByText("Waiting on ideas...")).toBeVisible();
  });
  
  test("Arrange ideas functionality works", async ({ presenter, browser, browserFactory }) => {
    await presenter.startIdeaWall();
    
    // Create players and submit multiple ideas
    const players = await browserFactory.createPlayers(browser, presenter.url, 3);
    
    await players[0].page.getByRole("textbox").fill("First idea");
    await players[0].page.getByRole("button", { name: "Send" }).click();
    
    await players[1].page.getByRole("textbox").fill("Second idea");
    await players[1].page.getByRole("button", { name: "Send" }).click();
    
    await players[2].page.getByRole("textbox").fill("Third idea");
    await players[2].page.getByRole("button", { name: "Send" }).click();
    
    // All ideas should be visible
    await expect(presenter.page.getByText("First idea")).toBeVisible();
    await expect(presenter.page.getByText("Second idea")).toBeVisible();
    await expect(presenter.page.getByText("Third idea")).toBeVisible();
    
    await presenter.page.getByRole("button", { name: "Arrange" }).click();
    
    // Wait for confirm dialog to appear and click it
    await presenter.page.getByRole("button", { name: "Ok" }).click();
    
    // Ideas should still be visible after arrangement
    await expect(presenter.page.getByText("First idea")).toBeVisible();
    await expect(presenter.page.getByText("Second idea")).toBeVisible();
    await expect(presenter.page.getByText("Third idea")).toBeVisible();
  });
});