<script>
  import StatCard from './StatCard.svelte';
  import { readableName } from './stats.js';

  // $state: what the trainer is typing, the Pokémon on show, and the status line.
  let query = $state('');
  let pokemon = $state(null);
  let status = $state('');
  let loading = $state(false);

  const lookUp = async (event) => {
    event.preventDefault();
    const name = query.trim().toLowerCase();
    if (name === '') {
      status = 'Type a Pokémon name first.';
      return;
    }
    // A second press while a lookup is out does nothing. The button stays
    // enabled, so keyboard focus isn't thrown off it.
    if (loading) return;

    loading = true;
    status = `Looking up ${name}…`;
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
      if (response.status === 404) {
        throw new Error(`There's no Pokémon called "${name}". Check the spelling and try again.`);
      }
      if (!response.ok) {
        throw new Error(`PokéAPI had a problem (status ${response.status}). Try again in a moment.`);
      }
      pokemon = await response.json();
      status = `Showing ${readableName(pokemon.name)}.`;
    } catch (error) {
      // fetch throws a TypeError only when it can't reach the server at all.
      status =
        error instanceof TypeError
          ? "Couldn't reach PokéAPI. Check your connection and try again."
          : error.message;
    } finally {
      loading = false;
    }
  };
</script>

<header>
  <h1>Stat card</h1>
  <p>Look up a Pokémon's base stats.</p>
</header>

<main>
  <form onsubmit={lookUp}>
    <label for="pokemon-name">Pokémon name</label>
    <input id="pokemon-name" type="text" autocomplete="off" bind:value={query} />
    <button type="submit">Look up</button>
  </form>

  <!-- On the page from the start, so screen readers announce every change. -->
  <p class="status" aria-live="polite">{status}</p>

  {#if pokemon}
    <StatCard {pokemon} />
  {/if}
</main>

<footer>
  <p><a href="../../">Back to the hub</a></p>
</footer>

<style>
  :global(body) {
    font-family: system-ui, sans-serif;
    line-height: 1.5;
    max-width: 40rem;
    margin: 0 auto;
    padding: 1rem;
  }

  form {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
  }

  input,
  button {
    font: inherit;
    padding: 0.25rem 0.5rem;
  }

  .status {
    min-height: 1.5em;
    font-weight: bold;
  }
</style>
