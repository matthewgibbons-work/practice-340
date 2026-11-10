<script>
  import { tick } from 'svelte';
  import { MAX_PARTY_SIZE, TYPES, filterByType, whyCantAdd, readSavedParty } from './party.js';

  // Beyond: start from last visit's party. readSavedParty never throws,
  // so missing or broken saved data gives an empty (or shorter) party.
  const saved = readSavedParty(localStorage.getItem('party'));

  // The party itself. Adds and removes make a new array.
  let party = $state(saved.party);

  // Saving to localStorage reaches outside the component, which is the job
  // $effect is for. It re-runs whenever party changes, so no handler can
  // forget to save, and its first run writes the cleaned-up party back.
  $effect(() => {
    localStorage.setItem('party', JSON.stringify(party));
  });

  // Fetches one Pokémon and keeps only what the page shows.
  async function fetchPokemon(name) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(name)}`);
    if (!response.ok) {
      throw new Error(`Couldn't find “${name}”. Check the spelling and try again.`);
    }
    const data = await response.json();
    // Capitalize here, not in CSS, so a screen reader hears "Remove Pikachu" too.
    return {
      id: data.id,
      name: data.name[0].toUpperCase() + data.name.slice(1),
      types: data.types.map((entry) => entry.type.name),
      sprite: data.sprites.front_default,
    };
  }

  // The lookup's state, as ONE value: 'idle', 'loading', or 'error'.
  // One value can't disagree with itself the way three true/false flags can.
  let status = $state('idle');
  let nameInput = $state('');

  async function lookUp(event) {
    event.preventDefault();
    const name = nameInput.trim().toLowerCase();
    if (name === '' || status === 'loading') {
      return;
    }
    status = 'loading';
    message = `Looking up ${name}…`;
    try {
      const pokemon = await fetchPokemon(name);
      const reason = whyCantAdd(party, pokemon);
      if (reason) {
        message = reason;
      } else {
        party = [...party, pokemon];
        message = `Added ${pokemon.name}.`;
        nameInput = '';
      }
      status = 'idle';
    } catch (error) {
      status = 'error';
      // A network failure (offline) has its own browser wording, so say it plainly.
      message = error instanceof TypeError ? 'Couldn’t reach PokéAPI. Check your connection.' : error.message;
    }
  }

  // Which type the trainer wants to see; 'all' shows everyone.
  let filter = $state('all');

  // Written by me (was a TODO(human)): the members to show. $derived works it
  // out again whenever party or filter changes, so it can't drift from party.
  const shown = $derived(filterByType(party, filter));

  // What the live region says. Changing it is how the page "speaks".
  let message = $state(
    saved.dropped > 0 ? 'Some of your saved party couldn’t be read, so it was left out.' : '',
  );

  let partyHeading;
  let list;

  async function remove(pokemon) {
    const index = shown.findIndex((member) => member.id === pokemon.id);
    party = party.filter((member) => member.id !== pokemon.id);
    message = `Removed ${pokemon.name}.`;
    // Wait for Svelte to take the row off the page before moving focus.
    await tick();
    const buttons = list.querySelectorAll('button');
    if (buttons.length === 0) {
      partyHeading.focus();
    } else {
      buttons[Math.min(index, buttons.length - 1)].focus();
    }
  }
</script>

<header class="banner">
  <h1>Party builder</h1>
  <p>Look up Pokémon by name and build a party of up to {MAX_PARTY_SIZE}.</p>
</header>

<main>
  <div class="layout">
    <section class="panel add" aria-labelledby="add-heading">
      <h2 id="add-heading">Add a Pokémon</h2>
      <form onsubmit={lookUp}>
        <label for="name">Pokémon name</label>
        <input id="name" bind:value={nameInput} autocomplete="off" aria-describedby="status" />
        <button type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Looking up…' : 'Add to party'}
        </button>
      </form>

      <!-- On the page from the start, so screen readers are already listening. -->
      <p id="status" class="status" class:error={status === 'error'} aria-live="polite">{message}</p>
    </section>

    <section class="panel party" aria-labelledby="party-heading">
      <div class="party-top">
        <h2 id="party-heading" bind:this={partyHeading} tabindex="-1">
          Your party ({party.length} of {MAX_PARTY_SIZE})
        </h2>
        <!-- The same count as dots. The heading already says it, so screen readers skip these. -->
        <span class="slots" aria-hidden="true">
          {#each { length: MAX_PARTY_SIZE }, i (i)}
            <span class="slot" class:filled={i < party.length}></span>
          {/each}
        </span>
      </div>

      <div class="filter">
        <label for="filter">Show type</label>
        <select id="filter" bind:value={filter}>
          <option value="all">All types</option>
          {#each TYPES as type (type)}
            <option value={type}>{type}</option>
          {/each}
        </select>
      </div>

      <ul bind:this={list}>
        {#each shown as pokemon (pokemon.id)}
          <li class="member">
            <img src={pokemon.sprite} alt="" width="96" height="96" />
            <span class="name">
              {pokemon.name}
              <span class="types">
                {#each pokemon.types as type (type)}
                  <span class="type">{type}</span>
                {/each}
              </span>
            </span>
            <button type="button" class="remove" onclick={() => remove(pokemon)}>Remove {pokemon.name}</button>
          </li>
        {:else}
          <li class="empty">
            {#if party.length === 0}
              Your party is empty. Look someone up to add them.
            {:else}
              Nobody in your party is {filter} type.
            {/if}
          </li>
        {/each}
      </ul>
    </section>
  </div>

  <p class="back"><a href="../../">Back to the hub</a></p>
</main>

<style>
  /* A cool "storage box" palette: pale blue page, white panels, deep indigo. */
  :global(:root) {
    --bg: #eef2fb;
    --surface: #ffffff;
    --text: #1b2240;
    --muted: #4a5375;
    --accent: #3046b8;
    --banner: #2b3a8c;
    --banner-soft: #c9d3ff;
    --chip: #e3e8f8;
    --chip-text: #24306b;
    --line: #6b759c;
    --error: #a40000;
  }

  :global(body) {
    margin: 0;
    background: var(--bg);
    color: var(--text);
    font-family: system-ui, sans-serif;
    line-height: 1.5;
  }

  main {
    max-width: 64rem;
    margin: 0 auto;
    padding: 0 1rem 2rem;
  }

  /* Outside main now, so it lines up with main's content by itself:
     1rem from each edge, and never wider than main's 64rem of content. */
  .banner {
    margin: 1.5rem max(1rem, (100% - 64rem) / 2) 0;
    padding: 1.5rem;
    background: var(--banner);
    color: #ffffff;
    border-radius: 0.75rem;
  }

  .banner h1 {
    margin: 0 0 0.25rem;
    font-size: 2.25rem;
    line-height: 1.2;
  }

  .banner p {
    margin: 0;
    color: var(--banner-soft);
  }

  /* Two panels side by side: a narrow one for adding, a wide one for the
     party. Below 48rem (a phone, or 200% zoom) they stack, add first. */
  .layout {
    display: grid;
    grid-template-columns: minmax(16rem, 20rem) 1fr;
    gap: 1.5rem;
    align-items: start;
    margin-top: 1.5rem;
  }

  @media (max-width: 48rem) {
    .layout {
      grid-template-columns: 1fr;
    }
  }

  .panel {
    padding: 1.25rem;
    background: var(--surface);
    border-radius: 0.75rem;
    box-shadow: 0 1px 3px rgb(27 34 64 / 0.12);
  }

  h2 {
    margin: 0 0 0.75rem;
    font-size: 1.25rem;
    line-height: 1.3;
  }

  h2:focus-visible,
  input:focus-visible,
  select:focus-visible,
  button:focus-visible,
  a:focus-visible {
    outline: 3px solid var(--accent);
    outline-offset: 2px;
  }

  /* ---------- Add panel ---------- */

  form {
    display: grid;
    gap: 0.5rem;
  }

  label {
    font-weight: 600;
  }

  input,
  select {
    min-height: 2.5rem;
    padding: 0.375rem 0.625rem;
    font: inherit;
    color: var(--text);
    background: var(--surface);
    border: 2px solid var(--line);
    border-radius: 0.5rem;
  }

  button {
    min-height: 2.5rem;
    padding: 0.375rem 1rem;
    font: inherit;
    font-weight: 600;
    border-radius: 0.5rem;
    cursor: pointer;
  }

  button[type='submit'] {
    background: var(--accent);
    color: #ffffff;
    border: 2px solid var(--accent);
  }

  button[type='submit']:disabled {
    background: var(--muted);
    border-color: var(--muted);
    cursor: progress;
  }

  .status {
    min-height: 1.5em;
    margin: 0.75rem 0 0;
    color: var(--muted);
  }

  .error {
    color: var(--error);
    font-weight: 700;
  }

  /* ---------- Party panel ---------- */

  .party-top {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: space-between;
    gap: 0.5rem 1rem;
  }

  .slots {
    display: flex;
    gap: 0.375rem;
  }

  .slot {
    width: 0.875rem;
    height: 0.875rem;
    border: 2px solid var(--line);
    border-radius: 50%;
  }

  .slot.filled {
    background: var(--accent);
    border-color: var(--accent);
  }

  .filter {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 0.75rem;
  }

  .member {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1rem;
    padding: 0.5rem 1rem 0.5rem 0.5rem;
    background: var(--bg);
    border-radius: 0.75rem;
  }

  img {
    background: var(--surface);
    border-radius: 0.5rem;
  }

  .name {
    flex-grow: 1;
    font-size: 1.125rem;
    font-weight: 700;
  }

  .types {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
    margin-top: 0.25rem;
  }

  .type {
    padding: 0 0.5rem;
    background: var(--chip);
    color: var(--chip-text);
    font-size: 0.8125rem;
    font-weight: 600;
    text-transform: capitalize;
    border-radius: 1rem;
  }

  .remove {
    background: var(--surface);
    color: var(--accent);
    border: 2px solid var(--accent);
  }

  .remove:hover {
    background: var(--accent);
    color: #ffffff;
  }

  .empty {
    padding: 1rem;
    color: var(--muted);
    border: 2px dashed var(--line);
    border-radius: 0.75rem;
  }

  a {
    color: var(--accent);
  }

  .back a {
    display: inline-block;
    padding-block: 0.25rem;
  }
</style>
