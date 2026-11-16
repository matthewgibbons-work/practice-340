<script lang="ts">
  // One member's card. It only shows `member`; it never changes it.
  // The buttons tell the parent what happened through onedit and onremove.
  interface Props {
    // The member object: a number id, text fields, a list of type names,
    // and a sprite address that may be missing (string | null means "text or nothing").
    member: {
      id: number;
      name: string;
      nickname: string;
      role: string;
      types: string[];
      sprite: string | null;
    };
    editing: boolean;
    onedit: () => void; // a function that takes nothing and returns nothing
    onremove: () => void;
  }

  let { member, editing, onedit, onremove }: Props = $props();
</script>

<article class="member" class:editing>
  {#if member.sprite}
    <!-- Decorative: the name right below says who it is. -->
    <img src={member.sprite} alt="" width="72" height="72" />
  {/if}
  <h3>{member.nickname}</h3>
  <p class="species">{member.name}</p>
  <p class="role">Role: <strong>{member.role}</strong></p>
  <ul class="types" aria-label="Types">
    {#each member.types as type (type)}
      <li>{type}</li>
    {/each}
  </ul>
  {#if editing}
    <p class="badge">Editing below</p>
  {/if}
  <div class="actions">
    <!-- The hidden nickname makes each button's name unique: "Edit Sparky", "Remove Sparky". -->
    <button type="button" onclick={onedit}>
      Edit<span class="visually-hidden"> {member.nickname}</span>
    </button>
    <button type="button" onclick={onremove}>
      Remove<span class="visually-hidden"> {member.nickname}</span>
    </button>
  </div>
</article>

<style>
  .member {
    display: grid;
    gap: 0.25rem;
    justify-items: start;
  }

  /* Being edited: a thick border AND the "Editing below" words, not color alone. */
  .editing {
    outline: 3px dashed var(--accent);
    outline-offset: 0.4rem;
  }

  img {
    image-rendering: pixelated;
    margin: -0.5rem 0 -0.5rem -0.5rem;
  }

  h3 {
    margin: 0;
    font-size: 1.25rem;
    overflow-wrap: anywhere;
  }

  p {
    margin: 0;
  }

  .species {
    color: var(--ink-soft);
    text-transform: capitalize;
  }

  .types {
    display: flex;
    flex-wrap: wrap;
    gap: 0.3rem;
    list-style: none;
    padding: 0;
    margin: 0.25rem 0;
  }

  .types li {
    border: 1px solid var(--ink-soft);
    border-radius: 999px;
    padding: 0 0.55rem;
    font-size: 0.85rem;
    text-transform: capitalize;
  }

  .badge {
    font-weight: 700;
    color: var(--accent);
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }
</style>
