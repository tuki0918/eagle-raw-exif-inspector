/// <reference types="vitest/config" />
import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  base: "./", // for Eagle Plugin
  plugins: [react(), tailwindcss()],
  test: {
    environment: "happy-dom",
    globals: true,
    setupFiles: "./vitest.setup.ts",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 11000, // Increase limit for C2PA WASM inline bundle
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate C2PA library into its own chunk
          c2pa: ["@contentauth/c2pa-web"],
        },
      },
    },
  },
});
