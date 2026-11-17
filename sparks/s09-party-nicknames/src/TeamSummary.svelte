<script>
  // Reads the same party PartyList shows: no prop, no copy of its own.
  import { party, displayName } from './party.svelte.js';

  let names = $derived(party.map(displayName));
</script>

<p class="summary">
  {#if names.length === 0}
    No members yet.
  {:else}
    <strong>{names.length} {names.length === 1 ? 'member' : 'members'}:</strong>
    {names.join(', ')}
  {/if}
</p>

<style>
  .summary {
    margin: 1rem 0 0;
    padding: 1rem;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 1rem;
  }
</style>
