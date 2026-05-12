// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

const base = process.env.ASTRO_BASE_PATH ?? '/ModWiki/';
// https://astro.build/config
export default defineConfig({
  site: "https://im23a-cernik.github.io",
  base,
  outDir: "./dist",
  output: "static",
  vite: {
    plugins: [tailwindcss()]
  }
});