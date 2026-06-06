import { Browser, BrowserContext, Page } from "@playwright/test";
import { Presenter } from "./presenter";
import { Player } from "./player";

export class BrowserFactory {
  private baseURL: string;
  private contexts: BrowserContext[] = [];

  constructor(baseURL?: string) {
    this.baseURL = baseURL || process.env.BASE_URL || "http://localhost:5273";
  }

  async createPresenter(browser: Browser): Promise<Presenter> {
    const context = await browser.newContext();
    this.contexts.push(context);
    const page = await context.newPage();

    await page.goto(this.baseURL);
    await this.waitForConnected(page);
    await page.getByRole("button", { name: "Present" }).click();
    await page.getByRole("button", { name: "Create" }).click();

    const url = await page
      .getByTestId("qrcode-link")
      .first()
      .getAttribute("href");
    if (!url) {
      throw new Error("Could not get lobby URL from QR code link");
    }

    return new Presenter(browser, page, url);
  }

  async createPlayer(
    browser: Browser,
    lobbyUrl: string,
    playerName: string = "test-user"
  ): Promise<Player> {
    const context = await browser.newContext();
    this.contexts.push(context);
    const page = await context.newPage();

    await this.joinLobby(lobbyUrl, page, playerName);
    return new Player(browser, page);
  }

  async createPlayers(
    browser: Browser,
    lobbyUrl: string,
    playerCount: number
  ): Promise<Player[]> {
    const playerPromises = Array.from({ length: playerCount }, (_, i) =>
      this.createPlayer(browser, lobbyUrl, `Player ${i + 1}`)
    );

    return Promise.all(playerPromises);
  }

  public async joinLobby(
    lobbyUrl: string,
    page: Page,
    playerName: string = "test-user"
  ): Promise<void> {
    await page.goto(lobbyUrl);
    // invokes made before the SignalR connection is up are silently dropped
    await this.waitForConnected(page);
    const textBox = page.getByRole("textbox");
    await textBox.waitFor({ state: "visible" });
    await textBox.fill(playerName);
    await page.getByTestId("join-lobby-button").click();
    // joining is only complete once the register form unmounts; interacting
    // earlier can target inputs that are about to be replaced by the game view
    await page
      .getByTestId("join-lobby-button")
      .waitFor({ state: "detached" });
  }

  private async waitForConnected(page: Page): Promise<void> {
    await page
      .locator('[data-testid="connection-status"][data-status="Connected"]')
      .first()
      .waitFor({ state: "attached" });
  }

  async createPlayerByJoinCode(
    browser: Browser,
    joinCode: string,
    playerName: string = "test-user"
  ): Promise<Player> {
    const context = await browser.newContext();
    this.contexts.push(context);
    const page = await context.newPage();

    await page.goto(this.baseURL);
    await page.getByRole("button", { name: "Join" }).click();
    await page.fill("#lobby-code", joinCode);
    await page.getByTestId("join-lobby").click();
    await page.fill("#user-name", playerName);
    await page.getByTestId("join-lobby-button").click();

    return new Player(browser, page);
  }

  async cleanup(): Promise<void> {
    await Promise.all(this.contexts.map((context) => context.close()));
    this.contexts = [];
  }

  static async joinLobby(
    lobbyUrl: string,
    page: Page,
    playerName: string = "test-user"
  ): Promise<void> {
    await page.goto(lobbyUrl);
    await page.fill("#user-name", playerName);
    await page.getByTestId("join-lobby-button").click();
  }
}
