<script>
  // Shows which attack types would hit several members hard, in words.
  // Reads the shared team; fetches each type's matchups from PokéAPI once.
  // No props, so no interface needed.
  import { team } from '../team.svelte.js';
  import { findWeakSpots } from '../weakness.js';

  // Type name → the attack types that do double damage to it. Fills up as types load.
  let relations = $state({});
  let loading = $state(false);
  let error = $state(null);
  let attempt = $state(0); // "Try again" bumps this, which re-runs the fetch

  // Each type on the team once, and the ones we haven't fetched yet.
  const types = $derived([...new Set(team.members.flatMap((m) => m.types))]);
  const missing = $derived(types.filter((type) => !(type in relations)));
  const ready = $derived(team.members.length > 0 && missing.length === 0);
  const spots = $derived(ready ? findWeakSpots(team.members, relations) : []);

  async function fetchDoubleDamageFrom(type) {
    const response = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
    if (!response.ok) {
      throw new Error(`PokéAPI couldn't send the ${type} matchups (error ${response.status}).`);
    }
    const data = await response.json();
    return data.damage_relations.double_damage_from.map((t) => t.name);
  }

  // When a new type joins the team, fetch the ones we're missing, all at once.
  $effect(() => {
    attempt; // read it so "Try again" re-runs this
    const wanted = missing;
    if (wanted.length === 0) {
      return;
    }
    loading = true;
    error = null;
    Promise.all(wanted.map(fetchDoubleDamageFrom))
      .then((lists) => {
        wanted.forEach((type, i) => {
          relations[type] = lists[i];
        });
      })
      .catch((err) => {
        error = err instanceof TypeError ? 'Couldn’t reach PokéAPI to check type matchups.' : err.message;
      })
      .finally(() => {
        loading = false;
      });
  });

  // One sentence the status region reads out when the answer changes.
  const summary = $derived.by(() => {
    if (team.members.length === 0) return 'Add members to see which attacks would hit several of them hard.';
    if (error !== null) return '';
    if (loading || !ready) return 'Checking type matchups…';
    if (spots.length === 0) return 'No single attack type hits two or more of your members hard.';
    return `${spots.length} weak ${spots.length === 1 ? 'spot' : 'spots'} found.`;
  });

  function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
</script>

<p role="status" class="summary">{summary}</p>

{#if error !== null}
  <p class="error">{error}</p>
  <button type="button" onclick={() => attempt++}>Try again</button>
{/if}

{#if ready && spots.length > 0}
  <ul class="spots">
    {#each spots as spot (spot.attackType)}
      <li>
        <strong>{capitalize(spot.attackType)}</strong> hits {spot.hit.length} of your {team.members.length} hard:
        {spot.hit.join(', ')}.
      </li>
    {/each}
  </ul>
{/if}

<style>
  .summary {
    margin: 0 0 0.75rem;
  }

  .spots {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: 0.5rem;
  }

  /* A warning stripe on the left plus the words: never color alone. */
  .spots li {
    background: var(--card);
    border-left: 6px solid var(--accent);
    padding: 0.6rem 0.9rem;
    border-radius: 0 var(--radius) var(--radius) 0;
  }
</style>
