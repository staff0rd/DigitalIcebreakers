import { test, expect } from "../fixtures/base";
import { Player } from "../helpers/player";
import { Presenter } from "../helpers/presenter";

test.describe("Pong Tests", () => {
  test("Teams are even", async ({ presenter, browser, browserFactory }) => {
    test.setTimeout(10_000);
    await presenter.startPong();

    // Create 6 players
    const players: Player[] = [];
    for (let i = 1; i <= 6; i++) {
      const player = await browserFactory.createPlayer(
        browser,
        presenter.url,
        `Player ${i}`
      );
      players.push(player);
    }

    // Initial team assignment
    await assertTeam(players, ["blue", "red", "blue", "red", "blue", "red"]);
    await teamsShouldBe(presenter, 3, 3);

    // Player 2 (red) leaves
    await players[1].page.close();
    await assertTeam(players, ["blue", "", "blue", "red", "blue", "red"]);
    await teamsShouldBe(presenter, 3, 2);

    // Player 3 (blue) leaves
    await players[2].page.close();
    await assertTeam(players, ["blue", "", "", "red", "blue", "red"]);
    await teamsShouldBe(presenter, 2, 2);

    // Player 4 (red) leaves
    await players[3].page.close();
    await assertTeam(players, ["blue", "", "", "", "blue", "red"]);
    await teamsShouldBe(presenter, 2, 1);

    // Player 6 (red) leaves
    await players[5].page.close();
    await teamsShouldBe(presenter, 1, 1);

    // Verify remaining players are on different teams
    const teams = [
      await players[0].page.getByTestId("team").textContent(),
      await players[4].page.getByTestId("team").textContent(),
    ];
    expect(teams).toContain("red");
    expect(teams).toContain("blue");

    // Clean up remaining players
    for (const player of players) {
      if (player.page.isClosed() === false) {
        await player.close();
      }
    }
  });
});

async function assertTeam(players: Player[], expectedTeams: string[]) {
  for (let i = 0; i < expectedTeams.length; i++) {
    const expected = expectedTeams[i];
    if (expected) {
      const actual = await players[i].page.getByTestId("team").textContent();
      expect(actual).toBe(expected);
    }
  }
}

async function teamsShouldBe(
  presenter: Presenter,
  expectedBlue: number,
  expectedRed: number
) {
  await presenter.page.waitForTimeout(50);
  const blueCount = await getPlayerCount(presenter, "blue-team");
  const redCount = await getPlayerCount(presenter, "red-team");
  expect(blueCount).toBe(expectedBlue);
  expect(redCount).toBe(expectedRed);
}

async function getPlayerCount(
  presenter: Presenter,
  teamId: string
): Promise<number> {
  const element = presenter.page.locator(`#${teamId}`);
  const count = await element.getAttribute("data-count");
  return parseInt(count || "0");
}
