import { Browser, expect } from "@playwright/test";
import { BrowserFactory } from "../helpers/browserFactory";
import { Presenter } from "../helpers/presenter";
import { Player } from "../helpers/player";

type BuzzerScenarioArgs = {
  presenter: Presenter;
  player: Player;
  browser: Browser;
  browserFactory: BrowserFactory;
};

export const buzzerShowsPlayerStatesOnPresenter = async ({
  presenter,
  player,
  browser,
  browserFactory,
}: BuzzerScenarioArgs) => {
  // Start the buzzer game
  await presenter.page.getByRole("link", { name: "New Activity" }).click();
  await presenter.page.getByTestId("game-buzzer").click();

  // Create a second player
  const player2Name = "Player 2";
  const player2 = await browserFactory.createPlayer(
    browser,
    presenter.url,
    player2Name
  );

  // Players are not visible until they interact with the buzzer
  await expect(presenter.page.getByText("test-user")).not.toBeVisible();
  await expect(presenter.page.getByText(player2Name)).not.toBeVisible();

  // Player 1 presses buzzer (hold down)
  const buzzerButton1 = player.page.getByRole("button", { name: "BUZZ" });
  await buzzerButton1.dispatchEvent("mousedown");

  // Verify player 1 appears and is selected on presenter
  const player1ListItem = presenter.page.getByRole("button", {
    name: "test-user",
  });
  await expect(player1ListItem).toBeVisible();
  await expect(player1ListItem).toHaveClass(/Mui-selected/);

  // Player 2 also presses buzzer (hold down)
  const buzzerButton2 = player2.page.getByRole("button", { name: "BUZZ" });
  await buzzerButton2.dispatchEvent("mousedown");

  // Verify both are now selected
  const player2ListItem = presenter.page.getByRole("button", {
    name: player2Name,
  });
  await expect(player1ListItem).toHaveClass(/Mui-selected/);
  await expect(player2ListItem).toHaveClass(/Mui-selected/);

  // Player 1 releases buzzer
  await buzzerButton1.dispatchEvent("mouseup");

  // Verify only player 2 is selected now
  await expect(player1ListItem).not.toHaveClass(/Mui-selected/);
  await expect(player2ListItem).toHaveClass(/Mui-selected/);
};
