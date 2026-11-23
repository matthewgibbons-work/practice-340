// Puts the site's base path in front of an internal link or asset.
// In `npm run dev` BASE_URL is "/"; on GitHub Pages the deploy workflow sets it to
// "/practice-340/sparks/astro-practice/", so url('party/') works in both places.
export const url = (path = '') =>
  `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
