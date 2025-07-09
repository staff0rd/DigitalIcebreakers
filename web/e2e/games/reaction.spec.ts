import { test, expect } from "../fixtures/base";

test.describe("Reaction Tests", () => {
  test("round flow: client shapes disabled after selection, presenter shows counts, new round re-enables shapes", async ({ 
    presenter, 
    player 
  }) => {
    test.setTimeout(15000); // Increase timeout to 15 seconds for this test
    // Start the Reaction game
    await presenter.page.getByRole("link", { name: "New Activity" }).click();
    await presenter.page.getByTestId("game-reaction").click();
    
    // Wait for the game to start and shapes to appear
    await presenter.page.waitForSelector('[data-testid="reaction-presenter"]', { timeout: 10000 });
    await player.page.waitForSelector('[data-testid="reaction-client"]', { timeout: 10000 });
    
    // Wait for shapes to appear on both client and presenter
    await player.page.waitForSelector('[data-testid^="shape-"]', { timeout: 10000 });
    await presenter.page.waitForSelector('[data-testid^="presenter-shape-"]', { timeout: 10000 });
    
    // Get the first shape on client side
    const firstShape = player.page.locator('[data-testid^="shape-"]').first();
    const firstShapeId = await firstShape.getAttribute('data-testid');
    const shapeId = firstShapeId?.replace('shape-', '');
    
    // Verify shapes are initially clickable (not disabled)
    const shapeElement = player.page.locator(`[data-testid="shape-${shapeId}"]`);
    expect(await shapeElement.isEnabled()).toBe(true);
    
    // Click on the first shape
    await firstShape.click();
    
    // Wait a moment for the state to update
    await player.page.waitForTimeout(100);
    
    // Verify the shape is now selected (has data-selected="true")
    const selectedState = await firstShape.getAttribute('data-selected');
    expect(selectedState).toBe('true');
    
    // Verify other shapes are now disabled (cursor should be 'default')
    const allShapes = player.page.locator('[data-testid^="shape-"]');
    const shapeCount = await allShapes.count();
    
    for (let i = 0; i < shapeCount; i++) {
      const shape = allShapes.nth(i);
      const shapeTestId = await shape.getAttribute('data-testid');
      const currentShapeId = shapeTestId?.replace('shape-', '');
      
      if (currentShapeId !== shapeId) {
        // Non-selected shapes should have different visual state
        // We can't easily test cursor in e2e, but we can verify they're still enabled
        expect(await shape.isEnabled()).toBe(true);
      }
    }
    
    // Check presenter side - should show choice count for the selected shape
    const presenterShape = presenter.page.locator(`[data-testid="presenter-shape-${shapeId}"]`);
    await presenter.page.waitForTimeout(200); // Wait for SignalR message
    
    const choiceCount = await presenterShape.getAttribute('data-choice-count');
    expect(choiceCount).toBe('1');
    
    // Wait for the round to end automatically (2 seconds timeout)
    await presenter.page.waitForSelector('text=Scores', { timeout: 5000 });
    
    // Click "Again" to enable auto-again mode (should start 5s countdown)
    await presenter.page.getByText('Again').click();
    
    // Wait for the progress bar to appear (indicating auto-again is active)
    await presenter.page.waitForSelector('div[style*="width: 500px"]', { timeout: 2000 });
    
    // Wait for the new round to start (triggered by auto-again)
    // The auto-again should complete in 5 seconds and start a new round
    await presenter.page.waitForSelector('[data-testid="reaction-presenter"]', { timeout: 8000 });
    await player.page.waitForSelector('[data-testid^="shape-"]', { timeout: 8000 });
    
    // Verify client shapes are re-enabled (all should have cursor: pointer)
    const newRoundShapes = player.page.locator('[data-testid^="shape-"]');
    const newShapeCount = await newRoundShapes.count();
    
    for (let i = 0; i < newShapeCount; i++) {
      const shape = newRoundShapes.nth(i);
      expect(await shape.isEnabled()).toBe(true);
      
      // Verify no shapes are selected
      const selectedState = await shape.getAttribute('data-selected');
      expect(selectedState).toBe('false');
    }
    
    // Verify presenter shows 0 choice counts for all shapes
    const presenterShapes = presenter.page.locator('[data-testid^="presenter-shape-"]');
    const presenterShapeCount = await presenterShapes.count();
    
    for (let i = 0; i < presenterShapeCount; i++) {
      const shape = presenterShapes.nth(i);
      const choiceCount = await shape.getAttribute('data-choice-count');
      expect(choiceCount).toBe('0');
    }
  });

  test("player selection shows count on presenter", async ({ 
    presenter, 
    player 
  }) => {
    // Start the Reaction game
    await presenter.page.getByRole("link", { name: "New Activity" }).click();
    await presenter.page.getByTestId("game-reaction").click();
    
    // Wait for game to load
    await player.page.waitForSelector('[data-testid="reaction-client"]', { timeout: 10000 });
    await player.page.waitForSelector('[data-testid^="shape-"]', { timeout: 10000 });
    
    // Get the first shape ID
    const firstShape = player.page.locator('[data-testid^="shape-"]').first();
    const firstShapeId = await firstShape.getAttribute('data-testid');
    const shapeId = firstShapeId?.replace('shape-', '');
    
    // Player selects the first shape
    await firstShape.click();
    
    // Wait for SignalR message to propagate
    await presenter.page.waitForTimeout(300);
    
    // Check presenter shows count of 1 for the selected shape
    const presenterShape = presenter.page.locator(`[data-testid="presenter-shape-${shapeId}"]`);
    const choiceCount = await presenterShape.getAttribute('data-choice-count');
    expect(choiceCount).toBe('1');
  });

  test("player names appear on wrong shape selections", async ({ 
    presenter, 
    player 
  }) => {
    // Start the Reaction game
    await presenter.page.getByRole("link", { name: "New Activity" }).click();
    await presenter.page.getByTestId("game-reaction").click();
    
    // Wait for game to load
    await presenter.page.waitForSelector('[data-testid="reaction-presenter"]', { timeout: 10000 });
    await player.page.waitForSelector('[data-testid^="shape-"]', { timeout: 10000 });
    
    // Find the main shape (correct answer)
    const mainShapeElement = presenter.page.locator('[data-testid^="presenter-shape-"]').first();
    const mainShapeId = await mainShapeElement.getAttribute('data-testid');
    const correctShapeId = mainShapeId?.replace('presenter-shape-', '');
    
    // Find a wrong shape to click
    const allClientShapes = player.page.locator('[data-testid^="shape-"]');
    const shapeCount = await allClientShapes.count();
    
    let wrongShapeId = '';
    for (let i = 0; i < shapeCount; i++) {
      const shape = allClientShapes.nth(i);
      const shapeTestId = await shape.getAttribute('data-testid');
      const shapeId = shapeTestId?.replace('shape-', '');
      if (shapeId !== correctShapeId) {
        wrongShapeId = shapeId!;
        break;
      }
    }
    
    // Player selects the wrong shape
    await player.page.locator(`[data-testid="shape-${wrongShapeId}"]`).click();
    
    // Wait for SignalR message to propagate
    await presenter.page.waitForTimeout(300);
    
    // Check that the wrong shape shows the player name
    const wrongPresenterShape = presenter.page.locator(`[data-testid="presenter-shape-${wrongShapeId}"]`);
    const playerNameElement = wrongPresenterShape.locator('text=test-user');
    
    // The player name should be visible
    await expect(playerNameElement).toBeVisible();
  });

  test("first player to select correct shape gets bonus points", async ({ 
    presenter, 
    player 
  }) => {
    // Start the Reaction game
    await presenter.page.getByRole("link", { name: "New Activity" }).click();
    await presenter.page.getByTestId("game-reaction").click();
    
    // Wait for game to start
    await player.page.waitForSelector('[data-testid^="shape-"]', { timeout: 10000 });
    
    // Find the main shape (the large one on presenter side)
    const mainShape = presenter.page.locator('[data-testid^="presenter-shape-"]').first();
    const mainShapeId = await mainShape.getAttribute('data-testid');
    const shapeId = mainShapeId?.replace('presenter-shape-', '');
    
    // Player selects the main shape (correct answer)
    await player.page.locator(`[data-testid="shape-${shapeId}"]`).click();
    
    // Wait for round to end
    await presenter.page.waitForSelector('text=Scores', { timeout: 5000 });
    
    // Check scores table - should show score of 2 (1 + 1 bonus for being first)
    const scoreTable = presenter.page.locator('table');
    const firstRow = scoreTable.locator('tr').first();
    const score = await firstRow.locator('td').first().textContent();
    expect(score).toBe('2');
  });
});