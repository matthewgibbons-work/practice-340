<script lang="ts">
  // The lineup board: six numbered slots, filled ones first, then open ones.
  // It reads the shared team directly; it changes nothing itself.
  import { team } from '../team.svelte.js';
  import { MAX_TEAM_SIZE } from '../rules.js';
  import TeamMember from './TeamMember.svelte';

  interface Props {
    editingId: number | null; // the id being edited, or null when none is
    onedit: (id: number) => void; // a function that takes an id number
    onremove: (id: number) => void;
  }

  let { editingId, onedit, onremove }: Props = $props();

  const openSlots = $derived(MAX_TEAM_SIZE - team.members.length);
</script>

<ol class="board">
  {#each team.members as member (member.id)}
    <li class="slot">
      <TeamMember
        {member}
        editing={member.id === editingId}
        onedit={() => onedit(member.id)}
        onremove={() => onremove(member.id)}
      />
    </li>
  {/each}
  <!-- { length: openSlots } is a list-like with that many empty places, one per open slot. -->
  {#each { length: openSlots }, i (i)}
    <li class="slot open">Open slot</li>
  {/each}
</ol>

<style>
  .board {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    /* Three across on a wide screen, fewer as the screen narrows or zooms. */
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 15rem), 1fr));
    gap: 1rem;
    counter-reset: slot;
  }

  .slot {
    position: relative;
    background: var(--card);
    border: 2px solid var(--ink);
    border-radius: var(--radius);
    padding: 1rem 1rem 1rem 3.25rem;
    min-height: 11rem;
    counter-increment: slot;
  }

  /* The big slot number down the left edge. */
  .slot::before {
    content: counter(slot);
    position: absolute;
    left: 0.75rem;
    top: 0.6rem;
    font: 700 1.75rem/1 var(--serif);
    color: var(--ink-soft);
  }

  .open {
    border-style: dashed;
    border-color: var(--ink-soft);
    background: transparent;
    color: var(--ink-soft);
    display: grid;
    align-items: center;
    font-style: italic;
  }
</style>
