import { test as base } from "./base";
import { BrowserFactory } from "../helpers/browserFactory";

export const test = base.extend({
  browserFactory: async ({ baseURL }, use) => {
    const factory = new BrowserFactory(baseURL, { transport: "firebase" });
    await use(factory);
    await factory.cleanup();
  },
});

export { expect } from "@playwright/test";
