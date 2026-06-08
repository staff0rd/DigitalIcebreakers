import { test, expect } from '../fixtures/base';

test.describe('Given a Presenter When refreshed', () => {
  test('Then presenter should connect after refresh', async ({ presenter, player }) => {
    // Note: player fixture ensures a player is connected, which is needed for the test
    expect(player).toBeDefined();
    
    await presenter.page.reload();

    const connectionIcon = presenter.page.getByTestId('connection-status').first();
    await expect(connectionIcon).toHaveAttribute('data-status', 'Connected');
  });
});