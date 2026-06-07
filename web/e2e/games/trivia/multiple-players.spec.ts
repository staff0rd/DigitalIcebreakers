import { test, expect } from "../../fixtures/firebase";

test.describe('Given Trivia with multiple players', () => {
  const CORRECT_ANSWER_ID = 'fa9cb6a8-a1e4-3337-f987-0cbca07bb88d';

  test('Selected answers display correctly', async ({ browser, presenter, browserFactory }) => {
    await presenter.loadTriviaQuestions();
    const players = await browserFactory.createPlayers(browser, presenter.url, 2);
    
    // All players select the correct answer
    await Promise.all(players.map(async (player) => {
      await player.page.getByRole('button', { name: 'correct' }).click();
      await player.page.getByRole('button', { name: 'Lock In & Send' }).click();
    }));
    
    // Show responses
    await presenter.page.getByTestId('show-responses').click();
    
    // Verify count
    const answer = presenter.page.getByTestId(`answer-${CORRECT_ANSWER_ID}`);
    const count = await answer.locator('.count').textContent();
    expect(parseInt(count!)).toBe(players.length);
  });
});