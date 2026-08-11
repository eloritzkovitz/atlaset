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
      registerType: "prompt",
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
      workbox: {
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        dontCacheBustURLsMatching: /\.[a-f0-9]{8}\./,
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
      },
      devOptions: {
        enabled: false,
      },
    }),
    ...(process.env.ANALYZE ? [visualizer({ open: true })] : []),
  ],
  resolve: {
    alias: {
      "@app": path.resolve(import.meta.dirname, "src/app"),
      "@components": path.resolve(import.meta.dirname, "src/shared/components"),
      "@config": path.resolve(import.meta.dirname, "src/shared/config"),
      "@constants": path.resolve(import.meta.dirname, "src/shared/constants"),
      "@features": path.resolve(import.meta.dirname, "src/features"),
      "@hooks": path.resolve(import.meta.dirname, "src/shared/hooks"),
      "@lib": path.resolve(import.meta.dirname, "src/lib"),
      "@services": path.resolve(import.meta.dirname, "src/shared/services"),
      "@test-utils": path.resolve(import.meta.dirname, "src/shared/test-utils"),
      "@types": path.resolve(import.meta.dirname, "src/shared/types"),
      "@utils": path.resolve(import.meta.dirname, "src/shared/utils"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("dexie")) return "vendor-dexie";
            if (id.includes("@firebase")) return "vendor-firebase";
            if (id.includes("@eloritzkovitz/atlaset-flags"))
              return "vendor-flags";
          }
        },
      },
    },
  },
});
