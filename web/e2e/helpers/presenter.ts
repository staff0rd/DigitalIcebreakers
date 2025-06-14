import { Browser, Page } from "@playwright/test";
import { AbstractBrowser } from "./abstractBrowser";

export class Presenter extends AbstractBrowser {
  constructor(browser: Browser, page: Page, public readonly url: string) {
    super(browser, page);
  }

  private async startGame(gameId: string): Promise<void> {
    await this.page.getByRole("link", { name: "New Activity" }).click();
    await this.page.getByTestId(`game-${gameId}`).click();
  }

  async loadTriviaQuestions(json: string = "questions.json"): Promise<void> {
    await this.startTrivia();
    await this.page.getByRole("button", { name: "Questions" }).click();
    const fileInput = await this.page.locator("[type=file]");
    await fileInput.setInputFiles(`./tests/Trivia/${json}`);
    await this.page.getByRole("button", { name: "Trivia" }).click();
  }

  async loadPollQuestions(json: string = "questions.json"): Promise<void> {
    await this.startPoll();
    await this.page.getByRole("button", { name: "Questions" }).click();
    const fileInput = await this.page.locator("[type=file]");
    await fileInput.setInputFiles(`./tests/Trivia/${json}`);
    await this.page.getByRole("button", { name: "Poll" }).click();
  }

  async startBroadcast(): Promise<void> {
    await this.startGame("broadcast");
  }

  async startRetrospective(): Promise<void> {
    await this.startGame("retrospective");
  }

  async startFistOfFive(): Promise<void> {
    await this.startGame("fist-of-five");
  }

  async startTrivia(): Promise<void> {
    await this.startGame("trivia");
  }

  async startPoll(): Promise<void> {
    await this.startGame("poll");
  }

  async startPong(): Promise<void> {
    await this.startGame("pong");
  }
}
