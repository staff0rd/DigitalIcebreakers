import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    proxy: {
      "/gameHub": {
        // 5050: macOS AirPlay Receiver occupies 5000
        target: "http://localhost:5050",
        ws: true, // Enable WebSocket proxy
      },
    },
  },
  define: {
    global: {},
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
    exclude: ["node_modules", "dist", "e2e/**"],
  },
});
