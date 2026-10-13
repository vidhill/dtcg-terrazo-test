import "@repo/react-app/fonts.ts";
import addonDocs from "@storybook/addon-docs";
import { definePreview } from "@storybook/react-vite";

import swatchbookAddon, {
  mergePresenters,
} from "@unpunnyfuns/swatchbook-addon";
import type { PresenterComponent } from "@unpunnyfuns/swatchbook-blocks";

import { MyColorSwatch } from "@repo/swatchbook-components";

export default definePreview({
  parameters: {
    options: {
      storySort: { order: ["Introduction", "Tokens", "Components"] },
    },
  },
  addons: [
    addonDocs(),
    swatchbookAddon({
      presenters: mergePresenters({
        // The registry types every entry as PresenterComponent<TokenType>;
        // this one is only ever invoked for `color` tokens.
        color: MyColorSwatch as PresenterComponent,
      }),
    }),
  ],
});
