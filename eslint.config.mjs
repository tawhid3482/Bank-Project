// @ts-check

import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";
import { no } from "zod/locales";

export default defineConfig(
  eslint.configs.recommended,
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  {
    rules: {
      "no-console": "warn",
      "no-unused-vars": "error",
    },
  }
);
