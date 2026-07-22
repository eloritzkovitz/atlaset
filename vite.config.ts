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
    }),
    ...(process.env.ANALYZE ? [visualizer({ open: true })] : []),
  ],
  resolve: {
    alias: {
      "@app/db": path.resolve(__dirname, "src/db"),
      "@app/firebase": path.resolve(__dirname, "src/firebase"),
      "@app/store": path.resolve(__dirname, "src/store"),
      "@components": path.resolve(__dirname, "src/shared/components"),
      "@config": path.resolve(__dirname, "src/shared/config"),
      "@constants": path.resolve(__dirname, "src/shared/constants"),
      "@contexts": path.resolve(__dirname, "src/contexts"),
      "@features": path.resolve(__dirname, "src/features"),
      "@hooks": path.resolve(__dirname, "src/shared/hooks"),
      "@layouts": path.resolve(__dirname, "src/layouts"),
      "@lib": path.resolve(__dirname, "src/lib"),
      "@services": path.resolve(__dirname, "src/shared/services"),
      "@test-utils": path.resolve(__dirname, "src/shared/test-utils"),
      "@types": path.resolve(__dirname, "src/shared/types"),
      "@utils": path.resolve(__dirname, "src/shared/utils"),
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
