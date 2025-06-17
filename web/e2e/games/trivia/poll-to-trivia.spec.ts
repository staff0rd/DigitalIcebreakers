import { test, expect } from '../../fixtures/base';

test.describe('Given Poll When switching to Trivia', () => {
  test.beforeEach(async ({ presenter, player }) => {
    expect(player).toBeDefined(); // Ensure player fixture is created
    await presenter.loadPollQuestions('questions1.json');
    await presenter.loadTriviaQuestions('questions2.json');
  });

  test('Then Poll Question is displayed on Presenter', async ({ presenter }) => {
    await presenter.startPoll();
    await presenter.page.waitForTimeout(500);
    const text = await presenter.page.locator('#question').textContent();
    expect(text).toBe('question1');
  });

  test('Then Trivia Question is displayed on Presenter', async ({ presenter }) => {
    await presenter.startTrivia();
    await presenter.page.waitForTimeout(500);
    const text = await presenter.page.locator('#question').textContent();
    expect(text).toBe('question2');
  });

  test('Then Poll Answers are displayed on Player', async ({ presenter, player }) => {
    await presenter.startPoll();
    await player.page.waitForTimeout(500);
    const text = await player.page.locator('.answer').first().textContent();
    expect(text).toBe('answer1');
  });

  test('Then Trivia Answers are displayed on Player', async ({ presenter, player }) => {
    await presenter.startTrivia();
    await player.page.waitForTimeout(500);
    const text = await player.page.locator('.answer').first().textContent();
    expect(text).toBe('answer2');
  });
});