import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import importPlugin from "eslint-plugin-import";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import { defineConfig, globalIgnores } from "eslint/config";
import eslintConfigPrettier from "eslint-plugin-prettier/recommended";
import vitestPlugin from "@vitest/eslint-plugin";

import {
  noInlineExportsRuleOptions,
  tsEnumSyntaxRuleOptions,
} from "./restricted-syntax-options.js";
import { generatePackageGroups } from "./utils.js";

export default defineConfig(
  globalIgnores([
    "**/dist/**",
    "**/build/**",
    "**/storybook-static/**",
    "**/.tokens/**",
    "**/.swatchbook/**",
  ]),
  {
    // Browser environment
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
  js.configs.recommended,
  eslintConfigPrettier,
  tseslint.configs.recommended,
  {
    files: ["**/*.ts", "**/*.mts", "**/*.tsx"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: {
          allowDefaultProject: [
            "eslint.config.js",
            "vite.config.ts",
            "vitest.config.ts",
            "terrazzo.config.ts",
            ".storybook/*.ts",
            ".storybook/*.mts",
          ],
        },
      },
    },
  },
  {
    plugins: {
      import: importPlugin,
      unicorn: eslintPluginUnicorn,
    },
    rules: {
      "no-console": "error",
      eqeqeq: "error",
      "object-shorthand": "error",
      "no-useless-rename": "error",
      curly: "error",
      "no-param-reassign": "error",

      "import/order": [
        "error",
        {
          "newlines-between": "always",
          warnOnUnassignedImports: true,
          pathGroups: [
            {
              pattern: "@repo/**",
              group: "external",
              position: "after",
            },
            {
              pattern: "@/**",
              group: "external",
              position: "after",
            },
          ],
          pathGroupsExcludedImportTypes: ["builtin"],
        },
      ],
      "import/exports-last": "error",
      "import/no-mutable-exports": "error",
      "import/no-duplicates": "error",

      // TypeScript rules (that don't require type information)
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          fixStyle: "separate-type-imports",
        },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      "@typescript-eslint/no-explicit-any": "error",
      // Enforce numeric separators for better readability
      "unicorn/numeric-separators-style": [
        "error",
        {
          number: {
            minimumDigits: 4,
            groupLength: 3,
          },
        },
      ],
      "unicorn/filename-case": [
        "error",
        {
          case: "kebabCase",
        },
      ],
    },
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "@typescript-eslint/prefer-nullish-coalescing": "error",
      "no-restricted-syntax": ["error", tsEnumSyntaxRuleOptions],
    },
  },
  {
    files: ["!**/*.stories.tsx"],
    rules: {
      "no-restricted-syntax": ["error", noInlineExportsRuleOptions],
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: generatePackageGroups(import.meta.dirname),
              message: "Use @repo/* imports instead of relative paths to other packages",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["**/*.spec.ts"],
    plugins: {
      vitest: vitestPlugin,
    },
    rules: {
      ...vitestPlugin.configs.recommended.rules,
      "vitest/no-disabled-tests": "error",
      "vitest/no-identical-title": "warn",
    },
  },
);
