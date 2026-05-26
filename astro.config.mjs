// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

import tailwindcss from '@tailwindcss/vite';

const base = process.env.ASTRO_BASE_PATH ?? '/ModWiki/';
// https://astro.build/config
export default defineConfig({
  site: "https://im23a-cernik.github.io",
  base,
  outDir: "./dist",
  output: "static",
  security: {
    checkOrigin: false
  },
  adapter: node({
    mode: "standalone"
  }),
  vite: {
    plugins: [tailwindcss()]
  }
});
