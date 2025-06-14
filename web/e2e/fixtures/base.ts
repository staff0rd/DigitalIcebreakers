import { test as base } from "@playwright/test";
import { BrowserFactory } from "../helpers/browserFactory";
import { Presenter } from "../helpers/presenter";
import { Player } from "../helpers/player";

type BaseFixtures = {
  browserFactory: BrowserFactory;
};

type TestFixtures = {
  presenter: Presenter;
  player: Player;
  joinCode: string;
};

export const test = base.extend<BaseFixtures & TestFixtures>({
  browserFactory: async ({ baseURL }, use) => {
    const factory = new BrowserFactory(baseURL);
    await use(factory);
    await factory.cleanup();
  },

  presenter: async ({ browser, browserFactory }, use) => {
    const presenter = await browserFactory.createPresenter(browser);
    await use(presenter);
  },

  player: async ({ browser, presenter, browserFactory }, use) => {
    const player = await browserFactory.createPlayer(browser, presenter.url);
    await use(player);
  },

  joinCode: async ({ presenter }, use) => {
    const joinCode = await presenter.page.getByTestId("lobby-id").textContent();
    if (!joinCode) {
      throw new Error("Could not get join code");
    }
    await use(joinCode);
  },
});

export { expect } from "@playwright/test";
