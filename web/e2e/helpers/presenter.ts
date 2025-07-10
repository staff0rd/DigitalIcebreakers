import { Browser, Page } from "@playwright/test";
import { AbstractBrowser } from "./abstractBrowser";
import path from "path";
import { fileURLToPath } from "url";

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
    await this.page.getByRole("link", { name: "Questions" }).click();
    const fileInput = await this.page.locator("[type=file]");
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const filePath = path.resolve(__dirname, "../test-data/trivia", json);
    await fileInput.setInputFiles(filePath);
    await this.page.getByRole("link", { name: "Trivia" }).click();
  }

  async loadPollQuestions(json: string = "questions.json"): Promise<void> {
    await this.startPoll();
    await this.page.getByRole("link", { name: "Questions" }).click();
    const fileInput = await this.page.locator("[type=file]");
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const filePath = path.resolve(__dirname, "../test-data/trivia", json);
    await fileInput.setInputFiles(filePath);
    await this.page.getByRole("link", { name: "Poll" }).click();
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

  async startYesNoMaybe(): Promise<void> {
    await this.startGame("yes-no-maybe");
  }

  async startNamePicker(): Promise<void> {
    await this.startGame("name-picker");
  }

  async startReaction(): Promise<void> {
    await this.startGame("reaction");
  }

  async startIdeaWall(): Promise<void> {
    await this.startGame("idea-wall");
  }
}
