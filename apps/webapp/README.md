# Webapp (`@repo/react-app`)

A small React + Vite demo showing design tokens being consumed **at runtime in the browser**

The app fetches a DTCG tokens file, runs it through Terrazzo in the browser (with the shared custom transforms), injects the generated CSS variables into the page.

Components style themselves using the generated css variables.

## Running

From the repository root:

```sh
pnpm install
pnpm --filter @repo/react-app dev        # Vite dev server
pnpm --filter @repo/react-app build      # tsc -b && vite build
pnpm --filter @repo/react-app preview    # serve the production build
pnpm --filter @repo/react-app typecheck
```

To change the theme, edit `packages/tokens/src/base.tokens.json` and reload.
