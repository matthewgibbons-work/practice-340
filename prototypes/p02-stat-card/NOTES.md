> Model answer, written by Claude for the instructor's practice repo.

# NOTES — P2 · Stat card

## Intent
A trainer deciding which Pokémon to train next. They type a name and need its base stats, and the total, readable as text rather than only as bars, so they can compare two Pokémon in their head. It has to work from the keyboard and tell a screen-reader user when a lookup finishes or fails.

## AI use
Claude Code in the desktop app, Learning output style. I gave it my intent and the done list: "Propose a short plan against the done list (scaffold, installs, which maths go in the module and which tests); if it covers it, go ahead without waiting. Leave any TODO(human) for me." It left the tie test as a `test.todo` for me.

## Accepted / changed / rejected
- Accepted: all the maths lives in `stats.js` (`statTotal`, `strongestStats`, `readableName`), and the card only calls it from `$derived` values. The tests use Pikachu's and Mr. Mime's real base stats, so a wrong total would show up.
- Accepted: `strongestStats` returns an array, because two stats can tie. I wouldn't have thought of that.
- Accepted: the form uses `onsubmit`, so Enter works, and the status paragraph with `aria-live="polite"` is on the page from the start.
- Wrote myself: the tie test, with Mew (every stat 100). To prove it can fail, I made `strongestStats` keep only the first match for a moment: the test went red ("1 failed | 6 passed"), then green when I put it back.
- No `$effect`: the lookup happens in the submit handler, and everything else is `$state` or `$derived`.

## Dig deeper
`Math.max()` with spread: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/max. `Math.max` takes separate numbers, not an array, so `...stats.map(...)` spreads the list of base stats out into separate arguments.

## Open questions
`{#if}` and `{#each}` are Monday's topic. I can read what they do here, but why does Svelte need its own blocks instead of plain JavaScript `if` and `.map()` in the markup?
