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
      command: "npm run dev -- --port 5273 --strictPort",
      url: "http://localhost:5273",
      reuseExistingServer: !process.env.CI,
    },
    {
      command: "dotnet run --project ../DigitalIcebreakers",
      // 5050 because macOS AirPlay Receiver squats on 5000 and its 403
      // satisfies the readiness probe, so the backend would never start
      url: "http://localhost:5050",
      reuseExistingServer: !process.env.CI,
      env: {
        // Without this the backend boots in Production, finds no wwwroot and 500s
        ASPNETCORE_ENVIRONMENT: "Development",
        ASPNETCORE_URLS: "http://localhost:5050",
      },
    },
  ],
});
