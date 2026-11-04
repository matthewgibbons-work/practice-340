> Model answer, written by Claude for the instructor's practice repo.

# NOTES — S03 · Promise party

## Intent
A trainer opening the app before a battle is waiting for their whole party to load at once. While it loads they should see that it's loading (not a blank page), and if one Pokémon can't be found they should be told which one, in words, instead of the page just stopping.

## AI use
Claude Code in the desktop app, Learning output style. I gave it my intent and the done list and asked for a plan first, then: "Do the one-at-a-time version first and tell me how to time it, then switch to Promise.all." It left the failure message as a `TODO(human)` for me.

Times from `console.time('party')`, three Pokémon:
- One at a time (`await` inside a `for...of` loop): about 3.0 s.
- `Promise.all`: about 1.0 s.

Each fake load waits one second. One at a time, each load only starts after the last one finishes, so the waits add up. With `Promise.all` all three start straight away and wait at the same time.

## Accepted / changed / rejected
- Accepted: `names.map(loadPokemon)` inside `Promise.all`, and the `try`/`catch`/`finally` so `console.timeEnd` runs even when one fails.
- Wrote myself: the `catch`. I empty the list first, so the trainer never sees part of a party that looks complete, and the status line says which Pokémon failed in words. The status paragraph has `role="status"`, so a screen reader reads the change too.
- Rejected: a `.catch()` that only logs to the console. The trainer can't see the console.

## Dig deeper
`Promise.all()`: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all. It rejects as soon as any one promise rejects, so one bad name throws away the two good ones. `Promise.allSettled()` waits for all of them and tells you which worked.

## Open questions
Should one missing Pokémon really hide the whole party? With `allSettled` I could show the two that loaded and a message for the third. I'm not sure which a trainer would want.
