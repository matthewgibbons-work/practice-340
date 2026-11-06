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
  <h1 bind:this={heading} tabindex="-1">My party</h1>

  {#await request}
    <p role="status">Loading your party…</p>
  {:then}
    <ul bind:this={list}>
      {#each party as pokemon (pokemon.id)}
        <li>
          <img src={pokemon.sprite} alt={pokemon.name} width="96" height="96" />
          <span class="name">{pokemon.name}</span>
          <button type="button" onclick={() => remove(pokemon)}>Remove {pokemon.name}</button>
        </li>
      {:else}
        <li>Your party is empty.</li>
      {/each}
    </ul>
  {:catch error}
    <p role="alert">{error.message}</p>
  {/await}

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
    align-items: center;
    gap: 1rem;
  }
  .name {
    flex-grow: 1;
  }
</style>
