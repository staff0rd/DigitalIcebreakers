import { test, expect } from "../fixtures/base";

test.describe("Given a Player When refreshed", () => {
  test("Then player should connect after refresh", async ({ player }) => {
    await player.page.reload();
    await player.page.waitForTimeout(1000);

    const connectionIcon = player.page.getByTestId("connection-status").first();
    const status = await connectionIcon.getAttribute("data-status");
    expect(status).toBe("Connected");
  });
});