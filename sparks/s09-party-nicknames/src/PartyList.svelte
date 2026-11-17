<script>
  import { tick } from 'svelte';
  import PartyMember from './PartyMember.svelte';
  import { party, remove, levelUp } from './party.svelte.js';

  // App starts the fetch and passes the Promise down, so {#await} can watch it.
  let { request } = $props();

  // bind:this fills this in with the real <ul> once it's on the page.
  // It needs $state because the <ul> appears later, inside {#await}.
  let list = $state();

  // PartyMember calls this (its onremove) with the id of the one to remove.
  async function handleRemove(id) {
    const index = remove(id);
    // Wait for Svelte to update the page, so the removed card is really gone.
    await tick();
    focusAfterRemove(index);
  }

  // Written by me in S08 (was a TODO(human)): where focus goes after a remove.
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
      <PartyMember {pokemon} onremove={handleRemove} onlevelup={levelUp} />
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
