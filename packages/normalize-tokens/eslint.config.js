import { defineConfig } from "eslint/config";

import baseConfig from "@repo/eslint-config";

const config = defineConfig(...baseConfig, {
  rules: {
    "no-console": "off",
  },
});

export default config;
