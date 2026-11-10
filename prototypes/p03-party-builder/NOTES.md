> Model answer, written by Claude for the instructor's practice repo.

# NOTES — P3 · Party builder

## Intent
A trainer getting ready for a gym battle (say, against water types). While they build, they need to see who's already in, be told straight away when an add breaks the rules (a seventh member, or someone who's already in), and filter to "only my electric types" before they decide. When they come back tomorrow, the party they built should be waiting, and if the saved copy is missing or broken the page should still load with an empty party instead of crashing.

## AI use
Claude Code in the desktop app, Learning output style. I gave it my Intent and the done list and followed the brief's order: "Plan first: the project, then the rules module and its tests, then a hard-coded party with remove and filter, then the lookup form. Leave the beyond for me to try first." It left the filter as a `TODO(human)`, and I wrote that line myself. For the beyond I wrote my own first attempt, then asked: "Give me two or three ways to save the party, and what each one costs. Don't fix it."

## Accepted / changed / rejected
- Accepted: the rules (`whyCantAdd`, `filterByType`) live in `party.js` with Vitest tests, and the page calls them. `whyCantAdd` returns the sentence to show, or `null`, so the page announces the same words the test checks. To prove the tests can fail I changed `>=` to `>` in the size check: two tests went red (the seventh add got through), then green when I put it back.
- Wrote myself: `const shown = $derived(filterByType(party, filter))`. With a second `$state` copy, removing someone would leave them in the filtered list.
- Changed: the agent first built the filter's options from the types already in the party. I switched to all 18 types, because "any water types?" should be a question I can ask and get "Nobody in your party is water type."
- Accepted: one `status` value (`'idle'`, `'loading'`, `'error'`) instead of `{#await}`, because after the fetch the page still has to run the rules and maybe add someone. The button is disabled while `status` is `'loading'`, and pressing it twice in a row adds only once.
- Accepted: focus after a remove goes to the next Remove button on screen (in the filtered list), or to the party heading when nobody's left. It uses `tick()` first, as in my S07.
- Known: a misspelled name leaves the browser's own red `404` line in the console. My code catches the error and shows it on the page, but the browser logs the failed request anyway.
- Changed: the layout. Once the beyond was done I asked for "two panels: adding on the left, the party on the right, stacking on a narrow screen, with a different look from S07." It put the banner inside `<main>`; I moved it out to its own `<header>` so it counts as the page's banner landmark. I accepted the six slot dots next to the heading and marked them `aria-hidden`, because the heading already says "3 of 6" and a screen reader doesn't need it twice.

## Beyond: what I tried
**My idea:** save the party in `localStorage` as JSON, and read it back when the page starts. Attempt 1 called a `save()` function at the end of add and remove, and started with `$state(JSON.parse(localStorage.getItem('party')) ?? [])`.

**Reload:** it worked. I built a party of three, reloaded, and they were all there. With nothing saved, `getItem` gives `null`, `JSON.parse(null)` is `null`, and `?? []` turned that into an empty party.

**Broken data:** this is where attempt 1 fell over. In DevTools → Application → Local storage I cut the value off halfway (`[{"id":25,"name":"Pika`) and reloaded. The page went **completely blank**, with `SyntaxError: Unterminated string in JSON` in the console: `JSON.parse` throws on text that isn't finished JSON, and because it ran while the component was being created, nothing drew at all. Then I tried an "older version" shape, `["pikachu","eevee"]` (just names). That one *is* valid JSON, so it parsed fine, and then the page crashed later, at the type labels, because a string has no `types` to loop over. Blank again.

**Attempt 2:** I moved the reading into `readSavedParty(text)` in `party.js`. It wraps `JSON.parse` in `try`/`catch`, checks it got a list, and keeps only members with a number `id`, a string `name`, and a `types` list, running each through `whyCantAdd`, so a hand-edited party of eight comes back as six. It never throws. It also returns how many it dropped, and the page says "Some of your saved party couldn't be read, so it was left out." Because it takes the text instead of reading `localStorage` itself, I could test the broken cases in Vitest (seven tests), not only by hand.

For saving, I opened the "Stuck?" hints, and the agent gave me three options: `save()` in every handler (what I had, but a new "Clear party" button could forget it), an `$effect` that saves whenever `party` changes, or saving on `pagehide` (only one write, but it isn't reliable on phones). I picked `$effect`. In S06 and P2 I wrote "no `$effect`" because nothing left the component, and saving to `localStorage` is exactly something leaving the component. A bonus I didn't plan: its first run writes the cleaned-up party back, so after one reload the broken value in storage was replaced with `[]`.

**Result:** reload with a party keeps it; the cut-off value and the names-only value both load an empty party with the message; deleting the key gives a normal empty first visit.

**Next I'd try:** saving a version number with the party (`{ version: 1, party: [...] }`) so a future format change can be read on purpose instead of thrown away. I'd also find out whether the "couldn't be read" message is actually announced, since it's already in the live region when the page first draws.

## Dig deeper
`JSON.parse()`: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse. It throws a `SyntaxError` for text that isn't valid JSON, but happily returns anything that *is* valid JSON, like a list of strings. So `try`/`catch` only handles half of "broken"; the other half needs checking the shape.

## Open questions
- Does a screen reader read an `aria-live` region's text if it's already there on the first draw, or only when it changes afterwards? If only on change, the "couldn't be read" message may only be seen, not heard.
- If I removed the same Pokémon twice in a row (add, remove, add, remove), the message is "Removed Pikachu." both times. Does the live region announce text that didn't change?
