<script>
  import { tick } from 'svelte';
  import PartyMember from './PartyMember.svelte';

  // The starting party. Misspell one (try 'eeveee') to see the error message.
  const STARTING_NAMES = ['pikachu', 'bulbasaur', 'eevee', 'snorlax'];

  // Everyone starts at level 5. PokéAPI has no "level", so it's our own data.
  const STARTING_LEVEL = 5;
  const MAX_LEVEL = 100;

  // Fetches one Pokémon and keeps only what the page shows.
  async function fetchPokemon(name) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    if (!response.ok) {
      throw new Error(`Couldn't find “${name}”.`);
    }
    const data = await response.json();
    // Capitalize here, not in CSS, so the button's name a screen reader hears
    // is "Remove Pikachu" too.
    const displayName = data.name[0].toUpperCase() + data.name.slice(1);
    return {
      id: data.id,
      name: displayName,
      sprite: data.sprites.front_default,
      level: STARTING_LEVEL,
    };
  }

  // The party. This component owns it: it's the only one that changes it.
  let party = $state([]);

  // Starts every fetch at once; Promise.all waits for all of them,
  // and rejects as soon as one fails.
  async function loadParty(names) {
    party = await Promise.all(names.map(fetchPokemon));
  }

  // The Promise {#await} watches. Assigning a new one would fetch again.
  let request = $state(loadParty(STARTING_NAMES));

  // bind:this fills this in with the real <ul> once it's on the page.
  // It needs $state because the <ul> appears later, inside {#await}.
  let list = $state();

  // PartyMember calls this (its onremove) with the id of the one to remove.
  async function remove(id) {
    const index = party.findIndex((member) => member.id === id);
    party = party.filter((member) => member.id !== id);
    // Wait for Svelte to update the page, so the removed card is really gone.
    await tick();
    focusAfterRemove(index);
  }

  // PartyMember calls this (its onlevelup). Changing member.level is fine
  // here, because PartyList owns the party.
  function levelUp(id) {
    const member = party.find((m) => m.id === id);
    if (member && member.level < MAX_LEVEL) {
      member.level += 1;
    }
  }

  // Written by me (was a TODO(human)): where focus goes after a remove.
  // It lives here, not in PartyMember, because only PartyList can see who's left.
  // Only the Remove buttons count, since each card has a Level up button too.
  // The one that slid into the removed spot gets focus, or the new last one,
  // or the "Your party is empty." line if nobody's left.
  function focusAfterRemove(removedIndex) {
    const removeButtons = list.querySelectorAll('.remove');
    if (removeButtons.length === 0) {
      list.querySelector('.empty').focus();
      return;
    }
    const next = Math.min(removedIndex, removeButtons.length - 1);
    removeButtons[next].focus();
  }
</script>

{#await request}
  <p role="status" class="status">Loading your party…</p>
{:then}
  <ul bind:this={list} class="party">
    {#each party as pokemon (pokemon.id)}
      <PartyMember {pokemon} onremove={remove} onlevelup={levelUp} />
    {:else}
      <li class="empty" tabindex="-1">Your party is empty.</li>
    {/each}
  </ul>
{:catch error}
  <p role="alert" class="error">{error.message}</p>
{/await}

<style>
  /* The party: as many cards per row as fit, one per row at 200% zoom. */
  .party {
    list-style: none;
    margin: 1rem 0 1.5rem;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(11rem, 100%), 1fr));
    gap: 1rem;
  }

  .empty,
  .status {
    color: var(--muted);
  }

  .empty:focus-visible {
    outline: 3px solid var(--text);
    outline-offset: 2px;
    border-radius: 0.25rem;
  }

  .error {
    padding: 0.75rem 1rem;
    background: var(--accent-soft);
    color: var(--accent);
    font-weight: 700;
    border-radius: 0.5rem;
  }
</style>
