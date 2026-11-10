<script>
  import { tick } from 'svelte';

  // The starting party. Misspell one (try 'eeveee') to see the error message.
  const STARTING_NAMES = ['pikachu', 'bulbasaur', 'eevee', 'snorlax'];

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
    return { id: data.id, name: displayName, sprite: data.sprites.front_default };
  }

  // The party itself. Remove buttons change this array.
  let party = $state([]);

  // Starts every fetch at once; Promise.all waits for all of them,
  // and rejects as soon as one fails.
  async function loadParty(names) {
    party = await Promise.all(names.map(fetchPokemon));
  }

  // The Promise {#await} watches. Assigning a new one would fetch again.
  let request = $state(loadParty(STARTING_NAMES));

  // bind:this fills these in with the real elements once they're on the page.
  // list needs $state because the <ul> appears later, inside {#await}.
  let heading;
  let list = $state();

  async function remove(pokemon) {
    const index = party.findIndex((member) => member.id === pokemon.id);
    party = party.filter((member) => member.id !== pokemon.id);
    // Wait for Svelte to update the page, so the removed row is really gone.
    await tick();
    focusAfterRemove(index);
  }

  // Written by me (was a TODO(human)): where focus goes after a remove.
  // The member that slid into the removed one's place gets focus, or the
  // new last one if I removed the end, or the heading if nobody's left.
  function focusAfterRemove(removedIndex) {
    const buttons = list.querySelectorAll('button');
    if (buttons.length === 0) {
      heading.focus();
      return;
    }
    const next = Math.min(removedIndex, buttons.length - 1);
    buttons[next].focus();
  }
</script>

<main>
  <div class="banner">
    <p class="kicker">Trainer party</p>
    <h1 bind:this={heading} tabindex="-1">My party</h1>
  </div>

  {#await request}
    <p role="status" class="status">Loading your party…</p>
  {:then}
    <ul bind:this={list} class="party">
      {#each party as pokemon (pokemon.id)}
        <li class="member">
          <img src={pokemon.sprite} alt={pokemon.name} width="96" height="96" />
          <span class="name">{pokemon.name}</span>
          <button type="button" onclick={() => remove(pokemon)}>Remove {pokemon.name}</button>
        </li>
      {:else}
        <li class="empty">Your party is empty.</li>
      {/each}
    </ul>
  {:catch error}
    <p role="alert" class="error">{error.message}</p>
  {/await}

  <p class="back"><a href="../../">Back to the hub</a></p>
</main>

<style>
  /* A warm trainer-card palette. Tokens on :root so the page behind
     the component matches too. */
  :global(:root) {
    --bg: #fff8ee;
    --surface: #ffffff;
    --text: #2b1d16;
    --muted: #6b4f3f;
    --accent: #b3261e;
    --accent-soft: #ffe1d6;
    --border: #e7c9b5;
  }

  :global(body) {
    margin: 0;
    background: var(--bg);
    color: var(--text);
    font-family: system-ui, sans-serif;
    line-height: 1.5;
  }

  main {
    max-width: 52rem;
    margin: 0 auto;
    padding: 1.5rem 1rem 2rem;
  }

  /* The red band at the top, with rounded corners like a card. */
  .banner {
    padding: 1.25rem 1.5rem;
    background: var(--accent);
    color: #ffffff;
    border-radius: 1rem;
  }

  .kicker {
    margin: 0;
    color: var(--accent-soft);
    font-size: 0.875rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  h1 {
    margin: 0;
    font-size: 2.25rem;
    line-height: 1.2;
  }

  h1:focus-visible {
    outline: 3px solid #ffffff;
    outline-offset: 4px;
    border-radius: 0.25rem;
  }

  /* The party: as many cards per row as fit, one per row at 200% zoom. */
  .party {
    list-style: none;
    margin: 1.5rem 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(11rem, 100%), 1fr));
    gap: 1rem;
  }

  .member {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 1rem;
    text-align: center;
  }

  /* A soft circle behind each sprite. */
  img {
    background: var(--accent-soft);
    border-radius: 50%;
  }

  .name {
    font-size: 1.25rem;
    font-weight: 700;
  }

  button {
    margin-top: auto;
    min-height: 2.5rem;
    padding: 0.375rem 0.875rem;
    background: var(--surface);
    color: var(--accent);
    font: inherit;
    font-size: 0.9375rem;
    font-weight: 600;
    border: 2px solid var(--accent);
    border-radius: 2rem;
    cursor: pointer;
  }

  button:hover {
    background: var(--accent);
    color: #ffffff;
  }

  button:focus-visible,
  a:focus-visible {
    outline: 3px solid var(--text);
    outline-offset: 2px;
  }

  .empty,
  .status {
    color: var(--muted);
  }

  .error {
    padding: 0.75rem 1rem;
    background: var(--accent-soft);
    color: var(--accent);
    font-weight: 700;
    border-radius: 0.5rem;
  }

  a {
    color: var(--accent);
  }

  .back a {
    display: inline-block;
    padding-block: 0.25rem;
  }
</style>
