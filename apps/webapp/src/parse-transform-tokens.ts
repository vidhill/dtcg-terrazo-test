// theme/loadTokens.ts
import type { OutputFile } from "@terrazzo/parser";
import { defineConfig, parse, build } from "@terrazzo/parser";
import { createTransformVisitors } from "@repo/token-transforms";
import pluginCSS from "@terrazzo/plugin-css";

const FILE_NAME = "tokens.css";

/**
 * Fetches a design tokens JSON file, runs it through the Terrazzo parser with
 * the custom token transforms, and builds the CSS output in memory.
 *
 * @param url
 * @returns The generated CSS string, or `null` if no string output was produced for the expected file.
 */
async function parseTransformTokensCSS(url: string) {
  const fileUrl = new URL(url, location.href);

  const srcJSON = await fetchTokensJSON(fileUrl);

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

  const { tokens, sources, resolver } = await parse(
    [
      {
        filename: fileUrl,
        src: srcJSON,
      },
    ],
    {
      config,
      transform: createTransformVisitors(),
    },
  );

  const buildResult = await build(tokens, {
    sources,
    config,
    resolver,
  });

  // build() returns in-memory output files
  const files = Array.isArray(buildResult)
    ? buildResult
    : buildResult.outputFiles;

  const matchingFile: OutputFile | undefined = files.find(
    (f) => f.filename === FILE_NAME,
  );

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
