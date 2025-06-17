import { Browser, Page } from "@playwright/test";

export abstract class AbstractBrowser {
  constructor(
    public readonly browser: Browser,
    public readonly page: Page
  ) {}

  async close(): Promise<void> {
    await this.page.context().close();
  }
}
