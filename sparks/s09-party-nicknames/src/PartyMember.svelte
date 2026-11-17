<script lang="ts">
  // What this component needs from its parent, and the type of each.
  // pokemon: an object with a number id, a string name, a string nickname
  //   ('' until someone saves one), a string sprite URL, and a number level.
  // onremove / onlevelup: functions that take a Pokémon's id (a number) and
  //   return nothing (void). PartyList passes them in; this card only calls them.
  interface Props {
    pokemon: { id: number; name: string; nickname: string; sprite: string; level: number };
    onremove: (id: number) => void;
    onlevelup: (id: number) => void;
  }

  let { pokemon, onremove, onlevelup }: Props = $props();

  // The nickname if there is one, so the buttons say "Remove Sparky".
  let label = $derived(pokemon.nickname || pokemon.name);
</script>

<!-- One card. It reads pokemon and calls back up; it never changes the party. -->
<li class="member">
  <img src={pokemon.sprite} alt={pokemon.name} width="96" height="96" />
  <span class="name">{label}</span>
  {#if pokemon.nickname}<span class="species">{pokemon.name}</span>{/if}
  <span class="level">Level {pokemon.level}</span>
  <div class="actions">
    <button type="button" class="level-up" onclick={() => onlevelup(pokemon.id)}>
      Level up {label}
    </button>
    <button type="button" class="remove" onclick={() => onremove(pokemon.id)}>
      Remove {label}
    </button>
  </div>
</li>

<style>
  .member {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 1rem;
    text-align: center;
  }

  /* A soft circle behind each sprite. */
  img {
    background: var(--accent-soft);
    border-radius: 50%;
  }

  .name {
    font-size: 1.25rem;
    font-weight: 700;
    line-height: 1.2;
  }

  .species {
    margin-top: -0.375rem;
    color: var(--muted);
    font-size: 0.875rem;
  }

  .level {
    color: var(--muted);
    font-size: 0.9375rem;
    font-weight: 600;
  }

  /* The two buttons stack full-width at the bottom of the card. */
  .actions {
    display: grid;
    gap: 0.5rem;
    width: 100%;
    margin-top: auto;
  }

  button {
    min-height: 2.5rem;
    padding: 0.375rem 0.875rem;
    font: inherit;
    font-size: 0.9375rem;
    font-weight: 600;
    border-radius: 2rem;
    cursor: pointer;
  }

  /* Level up: a soft fill, so it reads as the friendly action. */
  .level-up {
    background: var(--accent-soft);
    color: var(--text);
    border: 2px solid var(--muted);
  }

  .level-up:hover {
    background: var(--border);
  }

  /* Remove: the S07 outline that fills red on hover. */
  .remove {
    background: var(--surface);
    color: var(--accent);
    border: 2px solid var(--accent);
  }

  .remove:hover {
    background: var(--accent);
    color: #ffffff;
  }

  button:focus-visible {
    outline: 3px solid var(--text);
    outline-offset: 2px;
  }
</style>
