import { test, expect } from "../fixtures/firebase";

test.describe("Reaction Tests", () => {
  test("round flow: client shapes disabled after selection, presenter shows counts, new round re-enables shapes", async ({
    presenter,
    player,
  }) => {
    test.setTimeout(15000); // Increase timeout to 15 seconds for this test
    // Start the Reaction game
    await presenter.startReaction();

    // Wait for shapes to appear
    await player.page
      .getByTestId(/^shape-/)
      .first()
      .waitFor({ timeout: 10000 });

    // Get the first shape on client side
    const firstShape = player.page.getByTestId(/^shape-/).first();
    const firstShapeId = await firstShape.getAttribute("data-testid");
    const shapeId = firstShapeId?.replace("shape-", "");

    // Click on the first shape
    await firstShape.click();

    // Verify the shape is now selected
    const selectedState = await firstShape.getAttribute("data-selected");
    expect(selectedState).toBe("true");

    // Verify other shapes are now disabled
    const allShapes = await player.page.getByTestId(/^shape-/).all();

    await Promise.all(
      allShapes.map(async (shape) => {
        const shapeTestId = await shape.getAttribute("data-testid");
        const currentShapeId = shapeTestId?.replace("shape-", "");

        if (currentShapeId !== shapeId) {
          // Non-selected shapes should be disabled after selection
          const cursor = await shape.evaluate((el: Element) => {
            return (globalThis as any).getComputedStyle(el).cursor;
          });
          expect(cursor).toBe("default");
        }
      })
    );

    // Check presenter side - should show choice count for the selected shape
    const presenterShape = presenter.page.getByTestId(
      `presenter-shape-${shapeId}`
    );

    // Wait for SignalR message to update the choice count
    await expect(presenterShape).toHaveAttribute("data-choice-count", "1");

    // Wait for the round to end automatically (2 seconds timeout)
    await presenter.page.getByText("Scores").waitFor({ timeout: 5000 });

    // Click "Again" to enable auto-again mode (should start 5s countdown)
    await presenter.page.getByText("Again").click();

    // Wait for the new round to start (triggered by auto-again)
    // The auto-again should complete in 5 seconds and start a new round
    await presenter.page
      .getByTestId("reaction-presenter")
      .waitFor({ timeout: 8000 });
    await player.page
      .getByTestId(/^shape-/)
      .first()
      .waitFor({ timeout: 8000 });

    // Verify client shapes are re-enabled (all should have cursor: pointer)
    const newRoundShapes = await player.page.getByTestId(/^shape-/).all();

    await Promise.all(
      newRoundShapes.map(async (shape) => {
        expect(await shape.isEnabled()).toBe(true);

        // Verify no shapes are selected
        const selectedState = await shape.getAttribute("data-selected");
        expect(selectedState).toBe("false");
      })
    );

    // Verify presenter shows 0 choice counts for all shapes
    const presenterShapes = await presenter.page
      .getByTestId(/^presenter-shape-/)
      .all();

    await Promise.all(
      presenterShapes.map(async (shape) => {
        const choiceCount = await shape.getAttribute("data-choice-count");
        expect(choiceCount).toBe("0");
      })
    );
  });

  test("player names appear on wrong shape selections", async ({
    presenter,
    player,
  }) => {
    // Start the Reaction game
    await presenter.startReaction();

    // Wait for game to load
    await player.page
      .getByTestId(/^shape-/)
      .first()
      .waitFor({ timeout: 10000 });

    // Find the main shape (correct answer)
    const mainShapeElement = presenter.page
      .getByTestId(/^presenter-shape-/)
      .first();
    const mainShapeId = await mainShapeElement.getAttribute("data-testid");
    const correctShapeId = mainShapeId?.replace("presenter-shape-", "");

    // Find a wrong shape to click
    const allClientShapes = player.page.getByTestId(/^shape-/);
    const shapeCount = await allClientShapes.count();

    let wrongShapeId = "";
    for (let i = 0; i < shapeCount; i++) {
      const shape = allClientShapes.nth(i);
      const shapeTestId = await shape.getAttribute("data-testid");
      const shapeId = shapeTestId?.replace("shape-", "");
      if (shapeId !== correctShapeId) {
        wrongShapeId = shapeId!;
        break;
      }
    }

    // Player selects the wrong shape
    await player.page.getByTestId(`shape-${wrongShapeId}`).click();

    // Check that the wrong shape shows the player name
    const wrongPresenterShape = presenter.page.getByTestId(
      `presenter-shape-${wrongShapeId}`
    );
    const playerNameElement = wrongPresenterShape.locator("text=test-user");

    // Wait for SignalR message to propagate and player name to appear
    await expect(playerNameElement).toBeVisible();
  });

  test("first player to select correct shape gets bonus points", async ({
    presenter,
    player,
  }) => {
    // Start the Reaction game
    await presenter.startReaction();

    // Wait for game to start
    await player.page
      .getByTestId(/^shape-/)
      .first()
      .waitFor({ timeout: 10000 });

    // Find the main shape (the large one on presenter side)
    const mainShape = presenter.page.getByTestId(/^presenter-shape-/).first();
    const mainShapeId = await mainShape.getAttribute("data-testid");
    const shapeId = mainShapeId?.replace("presenter-shape-", "");

    // Player selects the main shape (correct answer)
    await player.page.getByTestId(`shape-${shapeId}`).click();

    // Wait for round to end
    await presenter.page.getByText("Scores").waitFor({ timeout: 5000 });

    // Check scores table - should show score of 2 (1 + 1 bonus for being first)
    const scoreTable = presenter.page.locator("table");
    const firstRow = scoreTable.locator("tr").first();
    const score = await firstRow.locator("td").first().textContent();
    expect(score).toBe("2");
  });
});
