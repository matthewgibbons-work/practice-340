> Model answer, written by Claude for the instructor's practice repo.

# NOTES — P1 · Async party

## Intent
A trainer planning a team for a weekend tournament. They need to see their starting party at a glance (names, pictures, types) and add one more by name, even on slow campus Wi-Fi. If they mistype a name or the network drops, they need to be told what happened, and so does a screen-reader user, not just someone watching the page.

## AI use
Claude Code in the desktop app, Learning output style. I gave it my intent and the done list: "Propose a short plan against the done list; if it covers it, go ahead without waiting. I'd like the stretch goal too (Promise.allSettled). Leave any TODO(human) for me." It left the add-form error message as a `TODO(human)`.

## Accepted / changed / rejected
- Accepted: the starting party loads with one `Promise.allSettled` over all the names, so they fetch in parallel and one bad name doesn't hide the rest.
- Accepted: the status paragraph has `aria-live="polite"` and is in the HTML from the start, so a screen reader hears every change to it.
- Wrote myself: the `catch` in the add form. `fetch` throws a `TypeError` only when it can't reach the server, so I check for that and say "check your connection"; anything else is my own error from `fetchPokemon`, which already says what went wrong.

## Dig deeper
`Promise.allSettled()`: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled. It never rejects; it gives back a list of `{ status, value }` or `{ status, reason }`, one per promise. `Promise.all` alone throws away every Pokémon that loaded as soon as one fails, which is the stretch goal's point: with `missingno` in the starting party, the others in the party still show (in my test, three loaded and the page said it couldn't load missingno).

## Open questions
Is `error instanceof TypeError` a safe way to spot "offline"? It feels like other mistakes in my code could be TypeErrors too.
