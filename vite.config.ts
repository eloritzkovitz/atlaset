import path from "path";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "/",
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
    }),
    ...(process.env.ANALYZE ? [visualizer({ open: true })] : []),
  ],
  resolve: {
    alias: {
      "@components": path.resolve(__dirname, "src/shared/components"),
      "@config": path.resolve(__dirname, "src/shared/config"),
      "@constants": path.resolve(__dirname, "src/shared/constants"),
      "@contexts": path.resolve(__dirname, "src/contexts"),
      "@features": path.resolve(__dirname, "src/features"),
      "@hooks": path.resolve(__dirname, "src/shared/hooks"),
      "@layout": path.resolve(__dirname, "src/layout"),
      "@services": path.resolve(__dirname, "src/shared/services"),
      "@test-utils": path.resolve(__dirname, "src/shared/test-utils"),
      "@types": path.resolve(__dirname, "src/shared/types"),
      "@utils": path.resolve(__dirname, "src/shared/utils"),
      "@db": path.resolve(__dirname, "src/db"),
      "@firebase": path.resolve(__dirname, "src/firebase"),
      "@store": path.resolve(__dirname, "src/store"),
    },
  },
});
