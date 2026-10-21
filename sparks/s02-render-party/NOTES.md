> Model answer, written by Claude for the instructor's practice repo.

# NOTES — S02 · Render the party

## Intent
A party page for a trainer who wants to see their team at a glance, level someone up after a training session, and drop a Pokémon they're done with. It has to work from the keyboard, because I wanted to see if I could do the whole thing without touching the mouse.

## AI use
Claude Code in the desktop app, Learning output style, plan mode first. I gave it my intent and pasted the "done" list, then: "Show my party array on the page, with a level-up and a remove button for each Pokémon. Build it with createElement, not innerHTML." Then `/dig-deeper main.js lines 12-40` on `makeItem` before I wrote the `TODO(human)`.

## Accepted / changed / rejected
- Accepted: building each item with `createElement` and `textContent`, and `replaceChildren()` to redraw the whole list from the array.
- Changed: the buttons first said just "Remove" and "Level up". With three of each, a screen reader can't tell them apart, so I asked for the Pokémon's name in each label ("Remove Pikachu").
- Wrote myself: `focusAfterRemove`. Claude left it as a `TODO(human)`. I send focus to the Remove button of whoever moved into that spot, or the heading if the party is empty. I picked Remove instead of Level up because if you're removing a few in a row, pressing Enter again keeps going.
- Rejected: Claude also offered to add the link to my hub. I did that myself so I knew where it went.

## Dig deeper
`replaceChildren()`: https://developer.mozilla.org/en-US/docs/Web/API/Element/replaceChildren. It removes all the old children and adds the new ones in one call, so I don't need a loop that removes items first. If you call it with nothing, it just empties the element.

## Open questions
Every render throws the old buttons away and makes new ones. That's why I have to put focus back by hand. Is that why frameworks like Svelte exist, or do they do the same thing underneath?
