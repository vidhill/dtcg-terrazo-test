import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import type { StorybookConfig } from "@storybook/react-vite";

const require = createRequire(import.meta.url);

const rwsPath = getAbsolutePath("@repo/react-app");

console.log({ rwsPath, a: rwsPath + "/src/**/*.stories.@(js|jsx|mjs|ts|tsx)" });

const config: StorybookConfig = {
  stories: [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    rwsPath + "/src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    rwsPath + "/src/**/*.mdx",
  ],
  addons: [
    "@storybook/addon-docs",
    {
      name: "@unpunnyfuns/swatchbook-addon",
      options: {
        configPath: "../swatchbook.config.ts",
      },
    },
  ],
  framework: {
    name: getAbsolutePath("@storybook/react-vite"),
    options: {},
  },
  core: {
    disableTelemetry: true,
  },
};

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string) {
  return dirname(require.resolve(join(value, "package.json")));
}

export default config;
