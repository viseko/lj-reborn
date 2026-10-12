// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

export default defineConfig([
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    languageOptions: {
      globals: globals.node,
    },
  },
  globalIgnores([
    "**/dist/",
    "**/.next/",
    "**/coverage/",
    "**/playwright-report/",
    "**/test-results/",
    "**/node_modules/", // игнорируется по умолчанию, но явный список не помешает
  ]),
  eslintConfigPrettier,
  {
    files: ["frontend/public/**/*.js"],
    languageOptions: {
      globals: globals.browser,
    },
  },
  ...storybook.configs["flat/recommended"],
]);
