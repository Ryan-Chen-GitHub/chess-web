import react from '@vitejs/plugin-react'
import { defineConfig } from "vitest/config";
// ...your existing plugin import stays as it is...

export default defineConfig({
  // ...your existing plugins line stays as it is...
  test: {
    environment: "jsdom",
    setupFiles: "./src/test-setup.ts",
  },
});