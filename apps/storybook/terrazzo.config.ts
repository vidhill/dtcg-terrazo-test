import { defineConfig } from '@terrazzo/cli';
import css from '@terrazzo/plugin-css';

// Production build of the same tokens swatchbook documents: `pnpm tokens`
export default defineConfig({
  tokens: ['./.tokens/resolver.json'],
  outDir: './dist/tokens/',
  plugins: [css({ filename: 'tokens.css' })],
});
