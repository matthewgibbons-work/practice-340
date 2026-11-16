<script>
  import { tick } from 'svelte';
  import { team, addMember, updateMember, removeMember } from './team.svelte.js';
  import { MAX_TEAM_SIZE } from './rules.js';
  import Panel from './lib/Panel.svelte';
  import TeamList from './lib/TeamList.svelte';
  import TeamSummary from './lib/TeamSummary.svelte';
  import MemberForm from './lib/MemberForm.svelte';
  import AddByName from './lib/AddByName.svelte';
  import WeakSpots from './lib/WeakSpots.svelte';

  let editingId = $state(null);
  let message = $state(''); // read out by the status region after a save or remove

  // The member being edited, or undefined when the form is closed.
  const editing = $derived(team.members.find((m) => m.id === editingId));

  // The form's button disappears when it closes, so send focus somewhere useful.
  async function closeForm() {
    editingId = null;
    await tick(); // wait for Svelte to update the page
    document.getElementById('team-heading').focus();
  }

  function handleSave(changes) {
    const reason = updateMember(editingId, changes);
    if (reason !== null) {
      return reason; // the form shows this next to the field
    }
    message = `Saved ${changes.nickname.trim()} as ${changes.role}.`;
    closeForm();
    return null;
  }

  async function handleRemove(id) {
    const gone = team.members.find((m) => m.id === id);
    removeMember(id);
    message = `Removed ${gone.nickname}.`;
    editingId = null;
    await tick();
    document.getElementById('team-heading').focus();
  }
</script>

<header class="masthead">
  <p class="eyebrow">P4 · DIGHT 340</p>
  <h1>Team planner</h1>
</header>

<main>
  <Panel id="add-heading" title="Add a member">
    <AddByName onfound={addMember} />
  </Panel>

  <Panel id="summary-heading" title="At a glance">
    <TeamSummary />
  </Panel>

  <Panel id="team-heading" title="Your team ({team.members.length} of {MAX_TEAM_SIZE})">
    <p class="status" role="status">{message}</p>
    <TeamList {editingId} onedit={(id) => (editingId = id)} onremove={handleRemove} />
  </Panel>

  {#if editing}
    <Panel id="edit-heading" title="Edit {editing.nickname}">
      {#key editing.id}
        <MemberForm
          member={editing}
          onsave={handleSave}
          oncancel={() => {
            message = '';
            closeForm();
          }}
        />
      {/key}
    </Panel>
  {/if}

  <Panel id="weak-heading" title="Weak spots">
    <WeakSpots />
  </Panel>
</main>

<footer class="footer">
  <p>Pokémon data from <a href="https://pokeapi.co/">PokéAPI</a>.</p>
</footer>

<style>
  .masthead,
  main,
  .footer {
    max-width: 56rem;
    margin-inline: auto;
    padding-inline: 1rem;
  }

  .masthead {
    padding-block: 2rem 0.5rem;
    border-bottom: 6px solid var(--ink);
  }

  .eyebrow {
    margin: 0;
    font-size: 0.85rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--ink-soft);
  }

  h1 {
    margin: 0.2rem 0 0;
    font-size: clamp(2rem, 6vw, 3.25rem);
  }

  .footer {
    padding-block: 1rem 2rem;
    border-top: 1px solid var(--line);
    color: var(--ink-soft);
  }

  .footer a {
    color: var(--ink);
  }

  /* Empty but still on the page (no display: none), so the live region is ready to announce. */
  .status:empty {
    min-height: 0;
    margin: 0;
    padding: 0;
    border: 0;
  }

  .status {
    margin: 0 0 0.75rem;
    font-weight: 600;
  }
</style>
