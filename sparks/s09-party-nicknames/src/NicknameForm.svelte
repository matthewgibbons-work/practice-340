<script>
  import { tick } from 'svelte';
  import { party, rename, displayName, MAX_NICKNAME } from './party.svelte.js';

  // $props.id() gives this form its own ids, so for/id and aria-describedby
  // can't clash with anything else on the page.
  const uid = $props.id();

  // Who's being renamed: the id last picked in the <select>, and what the box says.
  let memberId = $state();
  let nickname = $state('');

  // If nobody's been picked yet, or the one picked was removed, it's whoever is
  // first. $derived, not an $effect that sets memberId: nothing to keep in sync.
  let chosenId = $derived(party.some((m) => m.id === memberId) ? memberId : party[0]?.id);

  // The message in words. '' means no error: the alert element stays on the
  // page, empty, so screen readers are already watching it when words arrive.
  let error = $state('');
  // A quiet "Saved" line after a good save (role="status", not an alert).
  let saved = $state('');

  let box = $state();

  // Written by me (was a TODO(human)): the validation rule. Trim first, so
  // "   " counts as empty. The message says what's wrong and how to fix it.
  function check(value) {
    if (value === '') return 'Type a nickname first.';
    if (value.length > MAX_NICKNAME) {
      return `Nicknames can be up to ${MAX_NICKNAME} letters; “${value}” has ${value.length}.`;
    }
    return '';
  }

  async function save(event) {
    // onsubmit runs for the button and for Enter in the box; without this
    // the browser would send the form and reload the page.
    event.preventDefault();
    const value = nickname.trim();
    error = check(value);
    saved = '';
    if (error) {
      // Written by me (was a TODO(human)): where focus goes after an error.
      // Back to the box, with its text selected, so you can retype straight away.
      await tick();
      box.focus();
      box.select();
      return;
    }
    const member = party.find((m) => m.id === chosenId);
    const oldName = displayName(member);
    rename(chosenId, value);
    saved = `${oldName} is now ${value}.`;
    nickname = '';
  }
</script>

{#if party.length > 0}
  <form onsubmit={save}>
    <div class="field">
      <label for="{uid}-member">Who</label>
      <select
        id="{uid}-member"
        value={chosenId}
        onchange={(event) => (memberId = Number(event.currentTarget.value))}
      >
        {#each party as member (member.id)}
          <option value={member.id}>{displayName(member)}</option>
        {/each}
      </select>
    </div>

    <div class="field">
      <label for="{uid}-nickname">Nickname</label>
      <input
        id="{uid}-nickname"
        type="text"
        autocomplete="off"
        bind:value={nickname}
        bind:this={box}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby="{uid}-hint {uid}-error"
      />
      <p id="{uid}-hint" class="hint">Up to {MAX_NICKNAME} letters.</p>
      <p id="{uid}-error" class="error" role="alert">{error}</p>
    </div>

    <button type="submit">Save nickname</button>
    <p class="saved" role="status">{saved}</p>
  </form>
{:else}
  <p class="hint">Add someone to your party to give them a nickname.</p>
{/if}

<style>
  form {
    display: grid;
    gap: 0.75rem;
    margin-top: 1rem;
    padding: 1rem;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 1rem;
  }

  .field {
    display: grid;
    gap: 0.25rem;
  }

  label {
    font-weight: 700;
  }

  input,
  select {
    min-height: 2.5rem;
    padding: 0.375rem 0.625rem;
    font: inherit;
    color: var(--text);
    background: var(--surface);
    border: 2px solid var(--muted);
    border-radius: 0.5rem;
  }

  /* The border changes with the words, never instead of them. */
  input[aria-invalid='true'] {
    border-color: var(--accent);
    border-width: 3px;
  }

  .hint,
  .error,
  .saved {
    margin: 0;
  }

  .hint {
    color: var(--muted);
    font-size: 0.9375rem;
  }

  .error {
    color: var(--accent);
    font-weight: 700;
  }

  .saved {
    color: var(--muted);
    font-weight: 600;
  }

  button {
    justify-self: start;
    min-height: 2.5rem;
    padding: 0.375rem 1.125rem;
    font: inherit;
    font-weight: 700;
    color: #ffffff;
    background: var(--accent);
    border: 0;
    border-radius: 2rem;
    cursor: pointer;
  }

  input:focus-visible,
  select:focus-visible,
  button:focus-visible {
    outline: 3px solid var(--text);
    outline-offset: 2px;
  }
</style>
