import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    coverage: {
      provider: "v8",
      reportsDirectory: "./coverage",
      reporter: ["text", "html"],
      exclude: [
        "src/contexts/**",
        "src/shared/constants/**",
        "src/shared/test-utils/**",
        "src/shared/types/**",
        "**/index.ts",
        '**/*.json',
        '**/*.css',       
      ],
    },
  },
  resolve: {
    alias: {
      "@components": path.resolve(__dirname, "src/shared/components"),
      "@constants": path.resolve(__dirname, "src/shared/constants"),
      "@contexts": path.resolve(__dirname, "src/contexts"),
      "@features": path.resolve(__dirname, "src/features"),
      "@hooks": path.resolve(__dirname, "src/shared/hooks"),
      "@services": path.resolve(__dirname, "src/shared/services"),
      "@test-utils": path.resolve(__dirname, "src/shared/test-utils"),
      "@types": path.resolve(__dirname, "src/shared/types"),
      "@utils": path.resolve(__dirname, "src/shared/utils"),
    },
  },
});
