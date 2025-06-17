import { test, expect } from '../fixtures/base';

test.describe('Given a Presenter When refreshed', () => {
  test('Then presenter should connect after refresh', async ({ presenter, player }) => {
    // Note: player fixture ensures a player is connected, which is needed for the test
    expect(player).toBeDefined();
    
    await presenter.page.reload();
    await presenter.page.waitForTimeout(100);
    
    const connectionIcon = presenter.page.getByTestId('connection-status').first();
    const status = await connectionIcon.getAttribute('data-status');
    expect(status).toBe('Connected');
  });
});