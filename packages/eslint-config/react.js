import { defineConfig } from "eslint/config";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

import baseConfig from "./index.js";

export default defineConfig(baseConfig, {
  plugins: {
    react: reactPlugin,
    "react-hooks": reactHooks,
    "react-refresh": reactRefresh,
  },
  rules: {
    ...reactPlugin.configs.flat.recommended.rules,
    ...reactHooks.configs.recommended.rules,
    "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
    "react-hooks/exhaustive-deps": "error",
    "react/react-in-jsx-scope": "off",
    "react/self-closing-comp": "error",
    "react/jsx-curly-brace-presence": "error",
    "react/jsx-boolean-value": "error",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
});
