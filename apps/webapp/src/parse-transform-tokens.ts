// theme/loadTokens.ts
import type { OutputFile } from "@terrazzo/parser";
import { defineConfig, parse, build } from "@terrazzo/parser";
import pluginCSS from "@terrazzo/plugin-css";

import { createTransformVisitors } from "@repo/token-transforms";

const FILE_NAME = "tokens.css";

/**
 * Fetches design tokens JSON file(s), runs them through the Terrazzo parser with
 * the custom token transforms, and builds the CSS output in memory.
 *
 * @param urls One tokens file, or several; later files override earlier ones
 * (e.g. a base file followed by a theme file).
 * @returns The generated CSS string, or `null` if no string output was produced for the expected file.
 */
async function parseTransformTokensCSS(...urls: string[]) {
  const fileUrls = urls.map((u) => new URL(u, location.href));

  const filePromises = fileUrls.map((url) => {
    return fetchTokensJSON(url).then((srcContent) => {
      return {
        filename: url,
        src: srcContent,
      };
    });
  });

  const inputs = await Promise.all(filePromises);

  const config = defineConfig(
    {
      plugins: [
        pluginCSS({
          filename: FILE_NAME,
          legacyHex: true,
        }),
      ],
    },
    {
      cwd: new URL("/", location.href),
    },
  );

  const { tokens, sources, resolver } = await parse(inputs, {
    config,
    transform: createTransformVisitors(),
  });

  const buildResult = await build(tokens, {
    sources,
    config,
    resolver,
  });

  // build() returns in-memory output files
  const files = Array.isArray(buildResult) ? buildResult : buildResult.outputFiles;

  const matchingFile: OutputFile | undefined = files.find((f) => f.filename === FILE_NAME);

  if (!matchingFile || typeof matchingFile.contents !== "string") {
    return null;
  }

  return matchingFile.contents;
}

/**
 * Fetches a tokens file and validates that its body is parseable JSON.
 *
 * @param fileUrl - Absolute URL of the tokens JSON file.
 * @returns The raw response text (not the parsed object).
 * @throws {Error} `"not found"` if the response status is not 200, or `"invalid json"` if the body cannot be parsed as JSON.
 */
function fetchTokensJSON(fileUrl: URL) {
  return fetch(fileUrl)
    .then((res) => {
      if (res.status !== 200) {
        throw new Error("not found");
      }
      return res.text();
    })
    .then((val) => {
      try {
        JSON.parse(val);
      } catch (_err) {
        throw new Error("invalid json");
      }
      return val;
    });
}

export { parseTransformTokensCSS };
