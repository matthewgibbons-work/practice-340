<script lang="ts">
  // Looks a Pokémon up by name on PokéAPI, then hands it to the parent.
  // It doesn't add anything itself: onfound decides, using the team rules.
  interface Props {
    // Gets the Pokémon; returns null when it was added, or text saying why not.
    onfound: (pokemon: { id: number; name: string; types: string[]; sprite: string | null }) => string | null;
  }

  let { onfound }: Props = $props();

  let name = $state('');
  let loading = $state(false);
  let error = $state(null); // what's wrong, shown next to the field
  let status = $state(''); // loading and success messages, read out politely
  let nameInput;

  async function handleSubmit(event) {
    event.preventDefault();
    if (loading) {
      return; // one lookup at a time
    }
    const query = name.trim().toLowerCase();
    error = null;
    status = '';
    if (query === '') {
      error = 'Type a Pokémon name first, like pikachu.';
      nameInput.focus();
      return;
    }

    loading = true;
    status = `Looking up ${query}…`;
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(query)}`);
      if (!response.ok) {
        // 404 means "no such name"; anything else is PokéAPI having trouble.
        throw new Error(
          response.status === 404
            ? `No Pokémon is called “${query}”. Check the spelling.`
            : `PokéAPI couldn't answer (error ${response.status}). Try again in a moment.`,
        );
      }
      const data = await response.json();
      const reason = onfound({
        id: data.id,
        name: data.name,
        types: data.types.map((t) => t.type.name),
        sprite: data.sprites.front_default,
      });
      if (reason !== null) {
        throw new Error(reason);
      }
      status = `Added ${data.name}.`;
      name = '';
    } catch (err) {
      // A TypeError here means the request never got an answer (offline, blocked).
      error = err instanceof TypeError ? 'Couldn’t reach PokéAPI. Check your connection and try again.' : err.message;
      status = '';
      nameInput.focus();
    } finally {
      loading = false;
    }
  }
</script>

<form class="add" onsubmit={handleSubmit} novalidate aria-busy={loading}>
  <label for="add-name">Pokémon name</label>
  <div class="row">
    <input
      id="add-name"
      type="text"
      autocomplete="off"
      spellcheck="false"
      bind:value={name}
      bind:this={nameInput}
      aria-invalid={error !== null}
      aria-describedby={error !== null ? 'add-error' : undefined}
    />
    <button type="submit" class="primary">{loading ? 'Looking up…' : 'Add to team'}</button>
  </div>
  <p id="add-error" class="error" aria-live="assertive">{error ?? ''}</p>
  <p class="status" role="status">{status}</p>
</form>

<style>
  .add {
    display: grid;
    gap: 0.35rem;
  }

  label {
    font-weight: 600;
  }

  .row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  input {
    flex: 1 1 14rem;
    max-width: 24rem;
  }

  p {
    margin: 0;
  }

  /* Empty but still on the page (no display: none), so the live region is ready to announce. */
  p:empty {
    min-height: 0;
    margin: 0;
    padding: 0;
    border: 0;
  }

  .status {
    color: var(--ink-soft);
    font-weight: 600;
  }
</style>
