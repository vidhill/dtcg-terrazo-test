import { defineSwatchbookConfig } from "@unpunnyfuns/swatchbook-core";

export default defineSwatchbookConfig({
  resolver: ".tokens/resolver.json",
  default: { mode: "Light", brand: "A" },
  cssVarPrefix: "",
  presets: [],
});
