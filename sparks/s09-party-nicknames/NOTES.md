> Model answer, written by Claude for the instructor's practice repo.

# NOTES — S09 · Party nicknames

## Intent
My S08 party page, now with a nickname form and a Team summary beside it. It's for my friend, who renames everyone with the keyboard and sometimes uses VoiceOver to check things, and for anyone on a phone. When a nickname won't save, they need to hear why in words (empty, or too long and by how much) and land back in the box so they can fix it without hunting for it.

Prediction: Placeholder for a label → `<label for>` and an `id` on the input. Enter reloads → `onsubmit` on the form with `event.preventDefault()`. Error only red → `role="alert"` on a `<p>` and `aria-invalid` on the box. Focus left behind → `bind:this` on the input and `.focus()`. Summary's stale copy → move the party into `party.svelte.js` as `export const party = $state([])`, and have both components import it.

What it used: All five matched, with two things I didn't predict. For the error, the `role="alert"` `<p>` is on the page the whole time with nothing in it, and the box's `aria-describedby` points at both the hint and that `<p>`. The message just fills it in. For focus, it was `bind:this` and `.focus()`, but after `await tick()`, and it also calls `.select()` so the bad nickname is highlighted and typing replaces it. And for the stale copy, moving the party wasn't enough on its own: `loadParty` had to change from `party = await Promise.all(…)` to `party.push(...members)`, because a module can't export a `$state` that gets reassigned.

## AI use
Claude Code in the desktop app, Learning output style, plan mode first. I copied my S08 folder to `sparks/s09-party-nicknames/`, gave Claude my intent and the "done" list (not my prediction), and asked: "Before any code, tell me what moves into party.svelte.js, which component owns the form, and where the error and the focus code live." Its plan: the party and every function that changes it go in `party.svelte.js`; `App` starts the fetch; a new `NicknameForm` owns the form, the error, and the focus; a new `TeamSummary` only reads. I agreed, then had it go one file at a time, building after each. It left two `TODO(human)`s in `NicknameForm`: the validation rule and where focus goes after an error.

## Accepted / changed / rejected
- Accepted: `party.svelte.js` holds `export const party = $state([])` and `rename`, `remove`, `levelUp`, and `loadParty`. They change it from the inside (`push`, `splice`, `member.nickname = …`). `PartyList` lost its own `$state` and the fetch. I searched `src/` for `$state([` and `party =`: the only hits are the one in `party.svelte.js` and a comment.
- Accepted: `TeamSummary` imports `party` and `displayName`, with no props. I saved "Sparky" for Pikachu and the summary changed at the same moment as the card, the `<select>`, and the button names ("Remove Sparky").
- Accepted: the alert `<p>` is always there, empty until there's an error. With `{#if error}` around it, the element would appear at the same moment as its words, which screen readers often don't announce. `aria-invalid` is `'true'` only while there's an error, and `undefined` (no attribute) otherwise.
- Wrote myself (`TODO(human)`): the rule. Trim first, so spaces count as empty. Then "Type a nickname first." or "Nicknames can be up to 12 letters; “Thunderbolted” has 13." I put the count in the message because "too long" doesn't say by how much.
- Wrote myself (`TODO(human)`): focus. `await tick()`, then `box.focus()` and `box.select()`. The `tick()` waits for Svelte to put the message and `aria-invalid` on the page first, so when focus lands, the box already says it's invalid.
- Changed: it first used `bind:value` on the `<select>` with an `$effect` that set `memberId` back to the first member if the chosen one was removed. That's an effect setting state to keep two things in sync. I asked for a `$derived` instead: `chosenId` is the picked id if that member is still in the party, otherwise the first one. The `<select>` uses `value={chosenId}` and `onchange` now. I removed Evie while she was picked, and the `<select>` moved to Sparky with no warning.
- Changed: I used a labeled `<select>` instead of radio buttons, because my P4 already practises radios with `bind:group`, and four names fit in a dropdown.
- Rejected: `novalidate` on the form. There's no `required` or `maxlength` for the browser to check, so it did nothing, and I'd rather the form not look like it's switching something off.

## Dig deeper
`role="alert"` (https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/alert_role): it's a live region, so when its content changes a screen reader reads the new text right away, interrupting whatever it was saying. MDN says the element should already be in the page and then have its content changed, because some screen readers only watch live regions that existed before the change. That's why the empty `<p>` is there from the start. I also learned why the party is a `const` changed from the inside: other files import the variable itself, so if `party.svelte.js` pointed `party` at a new array, the importers would still hold the old one. Svelte's `state_invalid_export` error stops that before it happens.

## Open questions
After a good save, a `role="status"` line says "Pikachu is now Sparky." and the alert empties. Does a screen reader announce the alert going empty, or only the status? And `party[0]` is the fallback when nobody's picked. If the party is empty, the form isn't shown at all. Is hiding the whole form better than showing it disabled with a reason?
