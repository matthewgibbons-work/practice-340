import { defineConfig } from 'vite';

// base: './' makes the built page use relative paths (./assets/...),
// so it works inside sparks/s05-party-modules/ on GitHub Pages, not just at a site root.
export default defineConfig({
  base: './',
});
