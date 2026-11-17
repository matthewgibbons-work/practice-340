import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// The svelte() plugin teaches Vite to read .svelte files.
// base: './' keeps the built paths relative, so the page works on GitHub Pages.
export default defineConfig({
  plugins: [svelte()],
  base: './',
});
