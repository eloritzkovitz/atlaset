import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["src/shared/test-utils/firebaseMockRegistry.ts"],
    coverage: {
      provider: "v8",
      reportsDirectory: "./coverage",
      reporter: ["text", "html"],
      exclude: [
        "src/contexts/**",
        "src/shared/test-utils/**",
        "src/shared/types/**",
        "**/api/**",
        "**/components/**",
        "**/config/**",
        "**/constants/**",
        "**/layout/**",
        "**/types.ts",
        "**/index.ts",
        "**/*.json",
        "**/*.css",
      ],
    },
  },
  resolve: {
    alias: {
      "@app": path.resolve(__dirname, "src/app"),
      "@components": path.resolve(__dirname, "src/shared/components"),
      "@config": path.resolve(__dirname, "src/shared/config"),
      "@constants": path.resolve(__dirname, "src/shared/constants"),
      "@contexts": path.resolve(__dirname, "src/contexts"),
      "@features": path.resolve(__dirname, "src/features"),
      "@hooks": path.resolve(__dirname, "src/shared/hooks"),
      "@lib": path.resolve(__dirname, "src/lib"),
      "@services": path.resolve(__dirname, "src/shared/services"),
      "@test-utils": path.resolve(__dirname, "src/shared/test-utils"),
      "@types": path.resolve(__dirname, "src/shared/types"),
      "@utils": path.resolve(__dirname, "src/shared/utils"),
      "virtual:pwa-register/react": path.resolve(
        __dirname,
        "src/shared/test-utils/mockPwa.ts",
      ),
    },
  },
});
