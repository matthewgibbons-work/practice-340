> Model answer, written by Claude for the instructor's practice repo.

# NOTES — S05 · Party modules

## Intent
A party can hold at most six Pokémon, no level goes above 100, and you can't add the same Pokémon twice. A trainer planning a team relies on those rules being enforced, so they need tests that fail when a rule breaks, not just a page that looks right.

## AI use
Claude Code in the desktop app, Learning output style. I gave it my intent and the done list: "Propose a short plan against the done list (including any npm installs); if it covers it, go ahead without waiting. Leave any TODO(human) for me." It set up Vite and Vitest, moved the rules into `party.js`, and left the duplicate-Pokémon test as a `test.todo` for me.

## Accepted / changed / rejected
- Accepted: every rule in `party.js` returns a new array instead of changing the old one, so the tests can check that the original party is untouched.
- Accepted: `addPokemon` returns `{ ok, reason }` instead of throwing, so the page can show the reason in words.
- The test I trust least: "stops at the maximum level". It only starts at 100 and checks it stays at 100. If `levelUp` were broken and never changed levels at all, that test would still pass. It needs a second check that 99 goes to 100.
- Checks run: not run yet, because this isn't pushed. I'll add what it says after I push.
- Wrote myself: the duplicate test. To prove it can fail, I broke the rule in `party.js` for a moment: the test went red ("1 failed | 5 passed"), then green again when I put the rule back.

## Dig deeper
`export`: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export. Named exports are why the test file can import just the rules, without loading the page code that touches the DOM.

## Open questions
`vite build` puts everything in `dist/`, but the deploy workflow builds it again on GitHub. Why is `dist/` ignored in git instead of committed?
