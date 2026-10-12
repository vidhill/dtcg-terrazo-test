import addonDocs from "@storybook/addon-docs";
import { definePreview } from "@storybook/react-vite";
import swatchbookAddon from "@unpunnyfuns/swatchbook-addon";
import type { PresenterComponent } from "@unpunnyfuns/swatchbook-blocks";
import { MyColorSwatch } from "../src/Foo";

export default definePreview({
  parameters: {
    options: {
      storySort: { order: ["Introduction", "Tokens", "Components"] },
    },
  },
  addons: [
    addonDocs(),
    swatchbookAddon({
      presenters: {
        // The registry types every entry as PresenterComponent<TokenType>;
        // this one is only ever invoked for `color` tokens.
        color: MyColorSwatch as PresenterComponent,
      },
    }),
  ],
});
