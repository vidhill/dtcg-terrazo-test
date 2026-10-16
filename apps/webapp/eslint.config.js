import { defineConfig } from "eslint/config";

import baseConfig from "@repo/eslint-config/react-project";

const config = defineConfig(...baseConfig, {
  rules: {
    "no-console": "off",
  },
});

export default config;
