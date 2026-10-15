// Runs the token-transforms package over authored tokens and writes
// spec-compliant DTCG, which both `tz build` and swatchbook read. Neither
// exposes Terrazzo's `transform` option, so the visitors are applied here via
// parse().
import { print } from "@humanwhocodes/momoa";
import { createTransformVisitors } from "@repo/token-transforms";
import { defineConfig, parse } from "@terrazzo/parser";
import { cp, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { pathToFileURL } from "node:url";

type NormalizeTokensOptions = {
  /** Directory holding the authored `*.json` token files. */
  srcDir: string;
  /** Directory the normalized files are written to (emptied first). */
  outDir: string;
  /** Working directory handed to Terrazzo's config; defaults to process.cwd(). */
  cwd?: string;
};

async function normalizeTokens({
  srcDir,
  outDir,
  cwd = process.cwd(),
}: NormalizeTokensOptions) {
  // Empty first so a nested outDir isn't picked up as source below.
  await rm(outDir, { recursive: true, force: true });

  const fileList = await readdir(srcDir, {
    recursive: true,
    withFileTypes: true,
  });

  const files = fileList
    .filter((e) => e.isFile() && e.name.endsWith(".json"))
    .map((e) => join(e.parentPath, e.name));

  const jobs = files.map((file) => {
    const rel = relative(srcDir, file);
    return {
      file,
      rel,
      dest: join(outDir, rel),
    };
  });

  for (const { file, rel, dest } of jobs) {
    await mkdir(dirname(dest), {
      recursive: true,
    });

    // Resolver documents hold $refs, not tokens; copy them untouched.
    if (rel.endsWith("resolver.json")) {
      await cp(file, dest);
      continue;
    }

    const { sources } = await parse(
      [
        {
          filename: pathToFileURL(file),
          src: await readFile(file, "utf8"),
        },
      ],
      {
        config: defineConfig(
          {},
          {
            cwd: pathToFileURL(`${cwd}/`),
          },
        ),
        transform: createTransformVisitors(),
        skipLint: true,
        continueOnError: true,
      },
    );
    const document = sources[0]?.document;

    if (!document) {
      throw new Error(`No parsed document for ${rel}`);
    }

    await writeFile(
      dest,
      print(document, {
        indent: 2,
      }) + "\n",
    );
    console.log(`normalized ${rel}`);
  }
}

export { normalizeTokens };
export type { NormalizeTokensOptions };
