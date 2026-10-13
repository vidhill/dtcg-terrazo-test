import { defineMain } from "@storybook/react-vite/node";

export default defineMain({
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(ts|tsx)"],
  framework: "@storybook/react-vite",
  addons: [
    "@storybook/addon-docs",
    {
      name: "@unpunnyfuns/swatchbook-addon",
      options: {
        configPath: "../swatchbook.config.ts",
      },
    },
  ],
});
