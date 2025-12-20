import js from "@eslint/js";
import tseslint from "typescript-eslint";
import importPlugin from "eslint-plugin-import";

export default [
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    plugins: {
      import: importPlugin,
    },
    rules: {
      quotes: ["error", "double"],
      "import/no-unresolved": 0,
      indent: ["error", 2],
    },
    ignores: [
      "/lib/**/*",
      "/generated/**/*",
    ],
  },
];
