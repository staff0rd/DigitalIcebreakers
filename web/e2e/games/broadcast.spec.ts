import { test, expect } from "../fixtures/base";

test.describe("Broadcast Tests", () => {
  test("Broadcasted text appears on player", async ({ presenter, player }) => {
    await presenter.startBroadcast();
    await presenter.page.getByRole("textbox").fill("abcde");

    const text = await player.page.getByTestId("client-text").textContent();
    expect(text).toBe("abcde");
  });

  test("Broadcasted text appears on player after refresh", async ({
    presenter,
    player,
  }) => {
    await presenter.startBroadcast();
    await presenter.page.getByRole("textbox").fill("abc");
    await player.page.reload({ waitUntil: "domcontentloaded" });
    await presenter.page.getByRole("textbox").fill("abcde");
    await player.page.waitForTimeout(300);
    const text = await player.page.getByTestId("client-text").textContent();
    expect(text).toBe("abcde");
  });
});