> Model answer, written by Claude for the instructor's practice repo.

# NOTES — P4 · Team planner

## Intent
A planner for three friends building one tournament team together. Today it's a group chat, so nicknames get lost, the same Pokémon gets added twice, and nobody can see how many attackers they have. They need one page where everyone sees the same team: who's on it, each one's nickname and role, a count of roles and types that's always right, and, before the first battle, which kinds of attack would hit several of them hard. It has to work for the friend who only uses the keyboard, and errors have to say what's wrong in words.

## AI use
Claude Code, Learning style. I pasted the "done" list and asked for the plan first: the components with their props and callbacks, and which ones import the shared module. Its plan had eight components; four of them (`TeamList`, `TeamSummary`, `WeakSpots`, and `App`) import `team.svelte.js`, and the form keeps its own draft so it never changes the member it was handed. I said go, and to leave the weak-spot counting as a `TODO(human)`, because it was my idea. It built the rest in the order I asked, ran the tests and the build after each step, and linked it from the hub.

## Accepted / changed / rejected
- Accepted: the team is `export const team = $state({ members: [] })`, and `addMember`, `updateMember`, and `removeMember` in the same module are the only things that change it. Each returns `null` or the reason it refused, which is what the page shows.
- Accepted: `{#key member.id}` around the form, so editing a different member starts a fresh draft without an `$effect` copying state.
- Accepted: six numbered slots, with dashed "Open slot" cards, so "at most six" is something you can see. It's a single column, not P3's two panels.
- Changed: its test for "most hit first" expected Fire in second place, but Fighting also hits Magnemite and Scizor (both Steel), so they tie at two. I fixed the test to expect both, in the order the team first met them.
- Changed, after `/check`: every empty message (the form's error, the add status, the page status) was hidden with `display: none` while empty, which takes a live region out of the accessibility tree, so the first message might not be announced. They stay on the page now, just empty. Focus also moved before `aria-describedby` was added, so it now waits one `tick()`. And the panel title said "of 6" instead of using `MAX_TEAM_SIZE`.
- Wrote myself: `findWeakSpots` (the `TODO(human)`). I loop over members first, and put each member's attack types in a `Set`, so Magnemite (Electric and Steel, both weak to Ground) is only counted once for Ground.

## Next step: what I tried
My idea: collect the team's distinct types, fetch `/type/{name}` once for each with `Promise.all`, and for every attacking type count which members take double damage from it (`damage_relations.double_damage_from`). Anything that hits two or more members is a weak spot, shown in words. For a team of Pikachu and Magnemite it says "Ground hits 2 of your 2 hard: Pikachu, Magnemite." A team built to be weak on purpose (Pikachu, Jolteon, Magnemite) would list Ground first with all three. What I'd try next: it ignores immunities. Ground does nothing to Flying, so an Electric/Flying member isn't really weak to Ground; `no_damage_from` and `half_damage_from` would fix that.

## Dig deeper
`Set` (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) keeps only one of each value. Spreading two types' weakness lists into one `Set` is how a two-type member gets counted once per attack type, instead of once per type it has.

## Open questions
When the weak spots change after an add, is it announced, or does a screen reader user have to go and find the section? And should a failed `/type` request hide the whole section, or show the weak spots it could work out?
