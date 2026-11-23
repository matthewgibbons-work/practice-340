> Model answer, written by Claude for the instructor's practice repo.

# NOTES — S10 · Astro practice site

The site itself is in [`sparks/astro-practice/`](../astro-practice/); S11–S13 add to it.

## Intent
A small site about my party for my friend, who borrows my laptop with JavaScript blocked in the browser and still wants to see who I'm travelling with. With JavaScript off they should be able to read the home page, follow the nav, and see all four members with their number, types, and picture, with no spinner.

Prediction: JavaScript off → Astro sends HTML, so it just works. The spinner → `await fetch()` in the `---` part, so the data is already there. A second page → a new file in `src/pages/`. The nav → a layout in `src/layouts/` with `<slot />`. Links on Pages → `import.meta.env.BASE_URL`, plus `base` in `astro.config.mjs`.

What it used: Four of five matched. JavaScript off works because the build output has no `<script>` at all (I searched both built pages); nothing on these pages needs one. The party is fetched in `party.astro`'s frontmatter with `Promise.all`, and a failed answer throws, which stops the build. The second page is `src/pages/party.astro`, and the nav lives once in `src/layouts/Base.astro`. Where I was wrong: there's **no** `base` in `astro.config.mjs`. The deploy workflow passes `--base` when it builds, and a hard-coded one would be wrong in `npm run dev`. The links go through a `url()` helper in `src/lib/url.js` that puts `BASE_URL` in front.

## AI use
Claude Code in the desktop app, Explanatory output style (new since the Nov 23 kit update), plan mode first. I gave it my intent and the "done" list, not my prediction. Its plan: scaffold with the exact command from the brief, delete the template's README and `favicon.ico`, add the `url()` helper, then `Base.astro`, then the two pages, building after each. I asked: "Before you write the layout, how will the nav know which page it's on?" It said each page passes a `current` prop (its own path) and the layout compares that with each link. I agreed.

## Accepted / changed / rejected
- Accepted: the scaffold, `npm create astro@latest sparks/astro-practice -- --template minimal --no-git --install`. `ls -a sparks/astro-practice` shows no `.git`, and GitHub Desktop sees the files. I left the template's `AGENTS.md` alone, as the brief says.
- Accepted: `Base.astro` with `title` and `current` from `Astro.props`, one `<nav aria-label="Site">`, one `<main>` with `<slot />`, and `aria-current="page"` set to `undefined` (so the attribute disappears) on links that aren't the current page.
- Accepted: the favicon link goes through `url('favicon.svg')` too. The template had `href="/favicon.svg"`, which would 404 on Pages just like a page link.
- Changed: it first wrote the party fetch as a loop with `await` inside, one Pokémon after another. I asked for `Promise.all`, like my S03 and S09 work, so the four requests run at once and the build is quicker.
- Changed: the sprites had `alt="{name} sprite"`. The name is already in the `<h2>` right under it, so a screen reader would read it twice; I made the image `alt=""`.
- Rejected: a "Loading…" message on the party page. It suggested one out of habit from my Svelte pages, but nothing loads in the browser any more, so there's nothing to wait for.

★ Insight I agreed with: "The frontmatter runs once per build, so PokéAPI sees one request per deploy instead of one per visitor." That's the whole point of the spinner row.
★ Insight I questioned: it said throwing in the frontmatter is "safer than showing an error message." On my own computer, yes. But in the Action, a PokéAPI outage now means the folder is left out of the deploy and the run goes red. I think that's still right for a practice site (better a red run than a page with a hole), but it isn't free.

"Build time" for my data page means: when I run `npm run build`, or when GitHub's Action runs it after I push, Astro runs the code between the `---` fences, fetches the four Pokémon, and writes the answers into `dist/party/index.html`. A visitor gets that finished file. If Snorlax's types changed on PokéAPI tomorrow, my page wouldn't know until I rebuilt it.

## Verify
- `npm run build` in the site folder, then built again with the workflow's flags (`--site https://matthewgibbons-work.github.io --base /practice-340/sparks/astro-practice/`): every `href` in both built pages starts `/practice-340/sparks/astro-practice/`, and the only other URLs are the PokéAPI sprite images.
- Searched `src` for `href="/` and `src="/`: none.
- Both built pages have zero `<script>` tags, so they read the same with JavaScript off.
- View Source on `party/`: all four members are in the HTML.
- `src/pages/` has two files and `src/layouts/` one: the nav is written once.

## Dig deeper
`import.meta.env.BASE_URL` (https://docs.astro.build/en/reference/configuration-reference/#base): it's whatever `base` the build was given, or `/` if none. Astro's docs say it may or may not end in a slash depending on `trailingSlash`, which is why the helper strips the slash off the end of the base and off the front of the path before joining them. Without that, `url('party/')` could come out as `/practice-340/sparks/astro-practice//party/` or with no slash at all.

## Open questions
The sprite images come straight from GitHub's `raw.githubusercontent.com`, so the page still needs the network for pictures, just not for the words. Should a site like this copy them into `public/` at build time instead? And when S12 adds an island, will the island be the first `<script>` on these pages?
