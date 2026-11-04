<script>
  import { statTotal, strongestStats, readableName } from './stats.js';

  // The full PokéAPI answer for one Pokémon, passed in by App.
  const { pokemon } = $props();

  // $derived: all worked out by stats.js, so the tests cover the maths.
  // They rerun whenever App shows a different Pokémon.
  const total = $derived(statTotal(pokemon.stats));
  const strongest = $derived(strongestStats(pokemon.stats));
  const title = $derived(readableName(pokemon.name));
  const sprite = $derived(pokemon.sprites.front_default);
  const types = $derived(pokemon.types.map((entry) => readableName(entry.type.name)).join(', '));
</script>

<article aria-labelledby="card-title">
  <h2 id="card-title">{title}</h2>

  {#if sprite}
    <img src={sprite} alt="{title}, front view" />
  {/if}

  <p>Type: {types}</p>

  <table>
    <caption>Base stats</caption>
    <thead>
      <tr>
        <th scope="col">Stat</th>
        <th scope="col">Base</th>
      </tr>
    </thead>
    <tbody>
      {#each pokemon.stats as entry (entry.stat.name)}
        <tr>
          <th scope="row">{readableName(entry.stat.name)}</th>
          <td>
            {entry.base_stat}
            {#if strongest.includes(entry.stat.name)}
              <strong>(strongest)</strong>
            {/if}
          </td>
        </tr>
      {/each}
    </tbody>
    <tfoot>
      <tr>
        <th scope="row">Total</th>
        <td>{total}</td>
      </tr>
    </tfoot>
  </table>
</article>

<style>
  article {
    border: 1px solid #8888;
    border-radius: 0.5rem;
    padding: 1rem;
  }

  h2 {
    margin: 0;
  }

  img {
    width: 8rem;
    height: auto;
    image-rendering: pixelated;
  }

  table {
    border-collapse: collapse;
    width: 100%;
  }

  caption {
    text-align: left;
    font-weight: bold;
  }

  th,
  td {
    text-align: left;
    padding: 0.25rem 0.5rem;
    border-bottom: 1px solid #8888;
  }

  tfoot th,
  tfoot td {
    font-weight: bold;
  }
</style>
