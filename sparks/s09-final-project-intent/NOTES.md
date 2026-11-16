> Model answer, written by Claude for the instructor's practice repo.

# NOTES — S09 · Final Project intent brief

## Intent
I picked the Blake Archive, Slave Voyages, and Mapping Inequality because each one lets you *do* something you couldn't do with the original documents (compare printed copies, filter voyages by year, zoom into your own street on a 1930s map), and that's the answer to Jess's "what would I actually do?" I also looked at the Old Bailey Online and the Colored Conventions Project; both are great, but they're mostly reading, and I wanted at least one example close to art class.

## AI use
Claude Code, Learning style. I wrote `INTENT.md` myself, then ran the review prompt from the S09 brief. It couldn't find the Final Project brief's "done" list in the repo (it's on the course site), so it used mine. The question that changed my plan was the third one: if comparing copies is what grabs Jess, why does the only interactive part do something else? It didn't touch the file, and when I told it the definition stays a placeholder in this model repo, it skipped it without offering one.

## Accepted / changed / rejected
- Changed: done item 10 now has a date and a pass line (see Changes after review).
- Changed: the Blake island searches within Blake only.
- Accepted: the Blake page is the biggest page. I kept it, with a cut-off date.
- Rejected: dropping the Wikipedia boxes. They answer "what is it", which Jess asked too.

## Dig deeper
`client:visible` (https://docs.astro.build/en/reference/directives-reference/#clientvisible) loads an island's JavaScript only when it scrolls into view, using an `IntersectionObserver`. The Blake search is near the bottom of a long page, so most visitors who never scroll that far never download it.

## Open questions
Can I show Jess the side-by-side comparison without an API, maybe with two credited images of the same plate from the Archive? And is a Wikipedia summary a "credible source" for the home page, or only a starting point?
