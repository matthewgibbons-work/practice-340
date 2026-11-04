> Model answer, written by Claude for the instructor's practice repo.

# NOTES — S06 · Trainer card

## Intent
A trainer checking on one Pokémon between battles. At a glance they need its name, its level, and how many levels until it evolves, and they need to bump the level up or down from the keyboard without losing their place.

## AI use
Claude Code in the desktop app, Learning output style. I gave it my intent and the done list: "Propose a short plan against the done list (including the scaffold and installs); if it covers it, go ahead without waiting. Leave any TODO(human) for me." It set the project up by hand instead of with the Vite template, and left the evolve message as a `TODO(human)`. Afterwards I asked it to show me the `<script>` with `lang="ts"` (in the chat only), and ran `/dig-deeper` on the `untrack` line.

## Accepted / changed / rejected
- Runes, one by one:
  - `$props()` for `name`, `startLevel`, `evolvesAt`, and `evolvesInto`: they come from `App.svelte`, and the card never changes them.
  - `$state` for `level`: it's the one value the buttons change, and the card has to redraw when it does.
  - `$derived` for `levelsToEvolve` and `evolveMessage`: they're worked out from `level`, so they should follow it, never be set by hand.
  - No `$effect`: nothing here reaches outside the component, so there's nothing for one to do.
- Accepted: the buttons stay enabled at 1 and 100 and `Math.max`/`Math.min` stop the level instead, so focus never lands on a disabled button.
- Accepted, after `/dig-deeper`: `untrack(() => startLevel)`. Writing `$state(startLevel)` only reads the prop once, and Svelte warns that I might have meant it to keep following the prop. `untrack` says "yes, I only want the first value": after that, the buttons own the level.
- Wrote myself: `evolveMessage`, with three cases: several levels to go, exactly one ("One more level…!"), and already there.

TypeScript, in plain words: `startLevel: number;` in the `Props` interface means "App must pass a `startLevel`, and it has to be a number". If App passed the string `"12"`, the editor would underline it before I ever ran the page.

## Dig deeper
`$derived`: https://svelte.dev/docs/svelte/$derived. It reruns whenever something it reads changes, so `evolveMessage` updates when `levelsToEvolve` does, which updates when `level` does.

## Open questions
`untrack` means my card only ever uses the first `startLevel` App gives it. When would a card want to keep following a prop instead of taking it over?
