import { defineConfig } from "vitest/config";

// Security-rules tests run against a live database emulator (port 9100) via
// `npm run test:rules`; they are excluded from the default unit-test run
export default defineConfig({
  test: {
    include: ["rules/**/*.test.ts"],
    environment: "node",
    fileParallelism: false,
  },
});
