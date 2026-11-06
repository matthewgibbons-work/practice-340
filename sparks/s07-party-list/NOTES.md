> Model answer, written by Claude for the instructor's practice repo.

# NOTES — S07 · Party list

## Intent
A party page for a trainer on a slow phone, who might fat-finger a name and who might be using only a keyboard. While it loads they should see "Loading your party…", if a name is wrong the page should say which one, and when they've removed everybody it should say the party is empty instead of going blank.

Prediction: Loading → `{#await}`. A name is wrong → `{:catch}`. The party → `{#each}` with a `<button onclick>` in each row. After a remove → the key in brackets, `(pokemon.id)`, because then Svelte knows which row went and keeps the others (and their focus) in place. Nobody left → `{:else}` inside the `{#each}`.

What it used: Loading, a name is wrong, and nobody left matched: `{#await request}`, `{:catch error}`, and `{:else}` inside the `{#each}`. The party matched too: a keyed `{#each party as pokemon (pokemon.id)}` with `onclick={() => remove(pokemon)}` on a real `<button>`. After a remove, I had it backwards. The key doesn't keep focus in place. It's the reason focus is lost: with the key, the button I pressed is really deleted, so focus falls to the page. The fix was ordinary JavaScript: `await tick()` so Svelte finishes updating the page, then my `focusAfterRemove` calls `.focus()` on the next button. What the key does is make sure the row that disappears is the one I removed, so the "next button" really belongs to the next Pokémon.

## AI use
Claude Code in the desktop app, Learning output style, plan mode first. I gave it my intent and pasted the "done" list (not my prediction), then: "Plan it in small steps: the project, then the fetch with {#await}, then the list and remove, then focus. Leave where focus goes after a remove for me." I tested the error path by changing `'eevee'` to `'eeveee'` in `STARTING_NAMES` and changed it back.

## Accepted / changed / rejected
- Accepted: `Promise.all(names.map(fetchPokemon))` instead of awaiting in a loop, so all four requests start at once, and `party` as its own `$state` array that `loadParty` fills, with the Promise from `loadParty` in `request` for `{#await}` to watch. That way Remove changes `party` and doesn't touch the Promise.
- Changed: the first build warned `non_reactive_update` on `let list`. The `<ul>` is inside `{#await}`, so it shows up later, and Svelte said a plain `let` wouldn't update when it does. Making it `let list = $state()` fixed it.
- Changed: the names were capitalized with CSS `text-transform`, so they looked right, but the buttons were still "Remove pikachu" underneath. I moved the capital letter into the data so the button's name is "Remove Pikachu" for a screen reader too.
- Wrote myself: `focusAfterRemove` (the `TODO(human)`). It's my S02 answer almost line for line: focus the button of whoever slid into that spot, the last one if I removed the end, or the heading (`tabindex="-1"`) when nobody's left. The difference is that in S02 I needed it because `render()` threw away every button. Here Svelte keeps the other buttons, and I only need it because the one I pressed is gone. I also had to wait for `tick()` first, which S02 didn't need because `render()` ran right away.
- The key: `(pokemon.id)` tells Svelte which `<li>` belongs to which Pokémon. Without it, removing Bulbasaur would keep Bulbasaur's `<li>` and shift everyone's text up one row, deleting the last `<li>` instead. I tried it: I took the key out and turned off `focusAfterRemove`, and after removing Bulbasaur focus stayed on a button that now said "Remove Eevee". That's Bulbasaur's old button with Eevee's text in it. With the key back (and still no focus code), focus fell to `<body>`, because Bulbasaur's real button was deleted. So the key is why I need `focusAfterRemove` at all. Without the key, focus "works" here only by accident. If the row held anything else of its own, like text typed into it, that would end up on the wrong Pokémon.

## Dig deeper
`HTMLElement.focus()` and `tabindex="-1"`: https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex. A heading can't normally get focus. `tabindex="-1"` lets my code focus it without adding it to the Tab order, which is why focus can land on "My party" when the party is empty. Svelte's `tick()` (https://svelte.dev/docs/svelte/lifecycle-hooks#tick) is the other half: it waits until the page has caught up with my `$state` change.

## Open questions
When a name is wrong, the page says so, but the browser still prints a red 404 line in the console. Is that a "console error" I'm supposed to get rid of, or just what the browser always does when a fetch gets a 404? And if one name is wrong, should the page still show the other three instead of none?
