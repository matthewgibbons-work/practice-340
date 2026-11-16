<script>
  // Counts that are always right, because they're $derived from the shared
  // team: when a member is added, edited, or removed, these recount themselves.
  // No props, so no interface needed.
  import { team } from '../team.svelte.js';
  import { ROLES, MAX_TEAM_SIZE } from '../rules.js';

  const roleCounts = $derived(
    ROLES.map((role) => ({
      role,
      count: team.members.filter((m) => m.role === role).length,
    })),
  );

  // Every type on the team with how many members have it, most common first.
  const typeCounts = $derived.by(() => {
    const counts = {};
    for (const member of team.members) {
      for (const type of member.types) {
        counts[type] = (counts[type] ?? 0) + 1;
      }
    }
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  });
</script>

<dl class="stats">
  <div>
    <dt>Members</dt>
    <dd>{team.members.length} of {MAX_TEAM_SIZE}</dd>
  </div>
  {#each roleCounts as { role, count } (role)}
    <div>
      <dt>{role}s</dt>
      <dd>{count}</dd>
    </div>
  {/each}
</dl>

<p class="types">
  <strong>Types:</strong>
  {#if typeCounts.length === 0}
    none yet.
  {:else}
    {typeCounts.map(([type, count]) => `${type} ×${count}`).join(', ')}
  {/if}
</p>

<style>
  .stats {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin: 0;
  }

  .stats div {
    flex: 1 1 8rem;
    border-top: 4px solid var(--ink);
    padding-top: 0.4rem;
  }

  dt {
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--ink-soft);
  }

  dd {
    margin: 0;
    font: 700 1.75rem/1.2 var(--serif);
  }

  .types {
    margin: 0.75rem 0 0;
    text-transform: capitalize;
  }
</style>
