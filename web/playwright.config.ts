import { defineConfig, devices } from "@playwright/test";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./e2e",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ["list"],
    ["html", { open: "never" }],
    ["json", { outputFile: "test-results/e2e-results.json" }],
    ["./e2e/progressReporter.ts"],
  ],
  /* Test timeout */
  timeout: process.env.CI ? 30000 : 5000,
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // 5273, not the Vite default 5173: reuseExistingServer only checks the URL
    // responds, so on 5173 it happily reuses any other project's dev server
    baseURL: process.env.BASE_URL || "http://localhost:5273",

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "retain-on-failure",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: [
    {
      // --mode e2e loads .env.e2e, pointing the app at the dedicated e2e
      // emulator ports (9200/9299) so a running `npm run dev` session
      // (9000/9099) is never disturbed.
      command: "npm run dev:vite -- --port 5273 --strictPort --mode e2e",
      url: "http://localhost:5273",
      reuseExistingServer: !process.env.CI,
    },
    {
      command: "npm run dev:emulators:e2e",
      url: "http://localhost:9299",
      reuseExistingServer: !process.env.CI,
    },
  ],
});
