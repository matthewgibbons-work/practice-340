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

<main>
  <h1>Party builder</h1>

  <form onsubmit={lookUp}>
    <label for="name">Pokémon name</label>
    <input id="name" bind:value={nameInput} autocomplete="off" aria-describedby="status" />
    <button type="submit" disabled={status === 'loading'}>
      {status === 'loading' ? 'Looking up…' : 'Add to party'}
    </button>
  </form>

  <!-- On the page from the start, so screen readers are already listening. -->
  <p id="status" class="status" class:error={status === 'error'} aria-live="polite">{message}</p>

  <section aria-labelledby="party-heading">
    <h2 id="party-heading" bind:this={partyHeading} tabindex="-1">
      Your party ({party.length} of {MAX_PARTY_SIZE})
    </h2>

    <label for="filter">Show type</label>
    <select id="filter" bind:value={filter}>
      <option value="all">All types</option>
      {#each TYPES as type (type)}
        <option value={type}>{type}</option>
      {/each}
    </select>

    <ul bind:this={list}>
      {#each shown as pokemon (pokemon.id)}
        <li>
          <img src={pokemon.sprite} alt="" width="96" height="96" />
          <span class="name">
            {pokemon.name}
            <span class="types">{pokemon.types.join(' / ')}</span>
          </span>
          <button type="button" onclick={() => remove(pokemon)}>Remove {pokemon.name}</button>
        </li>
      {:else}
        <li>
          {#if party.length === 0}
            Your party is empty. Look someone up to add them.
          {:else}
            Nobody in your party is {filter} type.
          {/if}
        </li>
      {/each}
    </ul>
  </section>

  <p><a href="../../">Back to the hub</a></p>
</main>

<style>
  main {
    font-family: system-ui, sans-serif;
    line-height: 1.5;
    max-width: 40rem;
    margin: 0 auto;
    padding: 1rem;
  }
  ul {
    list-style: none;
    padding: 0;
  }
  li {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1rem;
  }
  .name {
    flex-grow: 1;
    font-weight: bold;
  }
  .types {
    display: block;
    font-weight: normal;
    text-transform: capitalize;
  }
  .status {
    min-height: 1.5em;
  }
  .error {
    font-weight: bold;
    color: #a40000;
  }
  form {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
  }
</style>
