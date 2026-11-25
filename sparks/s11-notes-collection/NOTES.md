> Model answer, written by Claude for the instructor's practice repo.

# NOTES — S11 · Notes collection

The work is in [`sparks/astro-practice/`](../astro-practice/): the notes index is at `/notes/`.

## Intent
My instructor reads these notes to grade Sparks, and I'd like to point a future employer at them as a record of how I work with an agent. Both should be able to open one index, see every Spark and Prototype in order, and read any note as a page, without clicking through GitHub folders. And I want the build to refuse a note with an empty section, so a hole can't go live.

Prediction: Reading them → `getCollection()` on an index page. An empty section → the schema. A new note → a dynamic route, `[id].astro`. The order → `getCollection()` again, because I think it returns them in folder order already.

What it used: Three of four matched. The index (`src/pages/notes/index.astro`) gets every note with `getCollection('notes')`. The schema in `src/content.config.js` stops the build on an empty section, and the error names the note's folder and the section. `src/pages/notes/[id].astro` makes one page per note with `getStaticPaths()`, so a new note gets a page with no new file. Where I was wrong: the order. `getCollection()` promises none. The loader reads folders with `readdir`, and the build log even generated `p01` before `s01`. The index sorts by folder name with `localeCompare` and then filters by `kind`, which is what puts Sparks first, in order.

## AI use
Claude Code in the desktop app, Explanatory output style, plan mode first. I gave it my intent and the "done" list (not my prediction) and said I'd pasted the course loader myself. I asked for the schema first, then a build, before any pages. When the build failed on my own unfinished S11 note, it listed the four empty sections and asked me questions instead of writing them. Then: "Go ahead with Steps 2, 3 and 4", and a build.

## Accepted / changed / rejected
- Accepted: the schema in `content.config.js`, with a `section()` helper so every section gets one message for a deleted heading (`undefined`) and an empty one (`''`). The message names the section the way my headings do, so the error reads on its own.
- Accepted: no extra `<h1>` on note pages. The note's own `# NOTES — …` line is the page's one `<h1>`; adding the title again would make two.
- Accepted: sorting in the index rather than trusting the loader's order.
- Rejected: changing the loader to fix the relative `../astro-practice/` links inside two notes. The loader is given, like `loadPokemon` in S03. It's an open question instead.
- Fixed myself: no old notes failed. The only note the build rejected was this one, until I wrote these sections.

★ Insight I agreed with: the build stops at the first failing note, so a clean build after a failure is what proves the later notes (P1–P4) pass, not the first error message.

## Verify
- `npm run build`: 16 notes pages, the index plus 15 notes, matching 11 Spark folders and 4 Prototype folders.
- Emptied P2's Open questions on purpose: `notes → p02-stat-card data does not match collection schema. openQuestions: The "Open questions" section is empty or missing.` Put it back; the build passes.
- The built index lists Sparks S01–S11, then Prototypes P1–P4; every note page has one `<h1>` and a "Back to all notes" link; the nav has Notes, and the links go through `url()`.

## Dig deeper
Where the schema runs: the loader calls `parseData()`, so the check happens while the content is read, before any page is rendered. That's why it was safe to build before any page existed. And `getStaticPaths()` runs once, at build time: one `{ params, props }` per note, where `params.id` is the folder name and becomes the URL.

## Open questions
Two of my notes link to `../astro-practice/`, which works on GitHub but not on a note page. Is there a fix that doesn't mean editing the loader?
