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
      "@app": path.resolve(import.meta.dirname, "src/app"),
      "@components": path.resolve(import.meta.dirname, "src/shared/components"),
      "@config": path.resolve(import.meta.dirname, "src/shared/config"),
      "@constants": path.resolve(import.meta.dirname, "src/shared/constants"),
      "@contexts": path.resolve(import.meta.dirname, "src/contexts"),
      "@features": path.resolve(import.meta.dirname, "src/features"),
      "@hooks": path.resolve(import.meta.dirname, "src/shared/hooks"),
      "@lib": path.resolve(import.meta.dirname, "src/lib"),
      "@services": path.resolve(import.meta.dirname, "src/shared/services"),
      "@test-utils": path.resolve(import.meta.dirname, "src/shared/test-utils"),
      "@types": path.resolve(import.meta.dirname, "src/shared/types"),
      "@utils": path.resolve(import.meta.dirname, "src/shared/utils"),
      "virtual:pwa-register/react": path.resolve(
        import.meta.dirname,
        "src/shared/test-utils/mockPwa.ts",
      ),
    },
  },
});
