import { test, expect } from "../fixtures/base";

test.describe("Given a Player When refreshed", () => {
  test("Then player should connect after refresh", async ({ player }) => {
    await player.page.reload();

    const connectionIcon = player.page.getByTestId("connection-status").first();
    await expect(connectionIcon).toHaveAttribute("data-status", "Connected");
  });
});