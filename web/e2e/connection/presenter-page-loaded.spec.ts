import { test, expect } from '../fixtures/base';

test.describe('Given a Presenter When page loaded', () => {
  test('Then should be connected', async ({ presenter }) => {
    const connectionIcon = presenter.page.getByTestId('connection-status').first();
    await expect(connectionIcon).toHaveAttribute('data-status', 'Connected');
  });
});