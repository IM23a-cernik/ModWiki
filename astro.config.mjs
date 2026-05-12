// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: "https://im23a-cernik.github.io",
  base: "/ModWiki",
  output: "static",
  vite: {
    plugins: [tailwindcss()]
  }
});