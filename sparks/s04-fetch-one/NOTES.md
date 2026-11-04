> Model answer, written by Claude for the instructor's practice repo.

# NOTES — S04 · Fetch one

## Intent
A new trainer who just heard a Pokémon's name and wants to look it up. While it loads they should see that something is happening, and if they mistype the name they should be told plainly that it wasn't found, not see a broken card or nothing at all.

## AI use
Claude Code in the desktop app, Learning output style. I gave it my intent and the done list, then: "Propose a short plan against the done list; if it covers it, go ahead without waiting. Leave any TODO(human) for me and tell me exactly where it is." It left the error message in `catch` as a `TODO(human)`.

## Accepted / changed / rejected
- Accepted: checking `response.ok` and throwing my own error. I didn't know `fetch` doesn't throw on a 404, so without that a wrong name would have tried to draw a card from an error page.
- Wrote myself: the `catch`. A wrong name and being offline both land there, so I check which one it is and say something different for each.
- Changed: the error paragraph had no role, so a screen reader wouldn't announce it. I added `role="alert"` to it, and `role="status"` to "Loading…".

## Dig deeper
`Response.ok`: https://developer.mozilla.org/en-US/docs/Web/API/Response/ok. It's true only for status 200–299. A 404 is still a "successful" fetch as far as the promise is concerned, because the server did answer.

## Open questions
Checking `error.message.startsWith('No Pokémon')` feels fragile. Is there a better way to tell my own error apart from a network one, like a custom error class?
