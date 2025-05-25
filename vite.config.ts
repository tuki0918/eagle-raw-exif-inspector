import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  base: "./", // for Eagle Plugin
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": "/workspaces/eagle-raw-exif-inspector/src",
    },
  },
});
