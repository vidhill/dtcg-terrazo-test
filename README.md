# terrazo-storybook

A pnpm monorepo demonstrating how to document [DTCG](https://www.designtokens.org/) design tokens using [Terrazzo](https://terrazzo.app)  
and displaying them in Storybook using [Swatchbook](https://github.com/unpunnyfuns/swatchbook).

Authored tokens are normalized into spec-compliant DTCG, then used by two consumers:

- **Terrazzo** (`tz build`) generates a production `tokens.css`.
- **Swatchbook** renders the same tokens as live documentation in Storybook.

## Requirements

- Node `>=24.14.0`
- [pnpm](https://pnpm.io/)

## Getting started

```sh
pnpm install
pnpm dev
```

Storybook runs at http://localhost:6006 and re-normalizes tokens whenever files in `apps/storybook/src/tokens` change.

## Scripts

Run from the repository root:

| Script              | Description                                                       |
| ------------------- | ----------------------------------------------------------------- |
| `pnpm dev`          | Start Storybook with token watching                               |
| `pnpm build`        | Normalize tokens and build static Storybook                       |
| `pnpm tokens`       | Normalize tokens and build `dist/tokens/tokens.css` with Terrazzo |
| `pnpm tokens:watch` | Re-run token normalization on changes                             |
| `pnpm test`         | Run tests in all packages (Vitest)                                |
| `pnpm typecheck`    | Type-check all packages                                           |

## Structure

```
apps/
  storybook/                  Storybook app (terrazzo-storybook-demo)
    src/tokens/               Authored tokens + DTCG resolver
    src/*.mdx, Button.*       Docs pages and example component
    terrazzo.config.ts        Terrazzo CSS build
    swatchbook.config.ts      Swatchbook config (reads .tokens/resolver.json)
packages/
  normalize-tokens/           CLI/library: applies transforms and writes normalized DTCG to .tokens
  token-transforms/           Terrazzo transform visitors (e.g. shorthand → DTCG objects), tested with Vitest
  swatchbook-components/      Custom React swatch blocks (colour, border radius, font scale)
  tsconfig/                   Shared TypeScript config
```

## How it works

1. Tokens are authored in `apps/storybook/src/tokens/` (`base.tokens.json` plus `resolver.json`).
2. `normalize-tokens` parses them with `@terrazzo/parser`, applies the visitors from `token-transforms` (for example `"14px"` → `{ value: 14, unit: "px" }`, and nested/hex colours → DTCG colour objects), and writes the result to `apps/storybook/.tokens/`.
   Neither Terrazzo's CLI nor Swatchbook exposes Terrazzo's `transform` option, so this step is done up front.
3. Both `tz build` and Swatchbook read from `.tokens/resolver.json`.
