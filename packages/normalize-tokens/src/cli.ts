#!/usr/bin/env node
// Usage: normalize-tokens <packageId> [srcDir] [outDir]
//   packageId  package to read tokens from, resolved from the cwd (e.g. @repo/tokens)
//   srcDir     relative to the resolved package directory (default: src)
//   outDir     relative to the cwd (default: .tokens)
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { normalizeTokens } from "./index.ts";

const [packageId, src = "src", out = ".tokens"] = process.argv.slice(2);

if (!packageId) {
  console.error("Usage: normalize-tokens <packageId> [srcDir] [outDir]");
  process.exit(1);
}

const require = createRequire(join(process.cwd(), "noop.js"));

/** Resolves the absolute directory of a package (works in monorepos / Yarn PnP). */
function getAbsolutePath(value: string) {
  return dirname(require.resolve(join(value, "package.json")));
}

await normalizeTokens({
  srcDir: join(getAbsolutePath(packageId), src),
  outDir: resolve(out),
});
