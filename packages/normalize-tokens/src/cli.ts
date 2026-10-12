#!/usr/bin/env node
// Usage: normalize-tokens [srcDir] [outDir]   (relative to the cwd)
import { resolve } from "node:path";
import { normalizeTokens } from "./index.ts";

const [src = "src/tokens", out = ".tokens"] = process.argv.slice(2);

await normalizeTokens({
  srcDir: resolve(src),
  outDir: resolve(out),
});
