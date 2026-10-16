import { defineConfig } from "eslint/config";
import storybook from "eslint-plugin-storybook";

import reactBaseConfig from "./react.js";

export default defineConfig(...reactBaseConfig, ...storybook.configs["flat/recommended"]);
