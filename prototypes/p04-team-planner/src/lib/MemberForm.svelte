<script lang="ts">
  // Edits one member's nickname and role.
  // It keeps its own draft (nickname, role) so typing never changes `member`
  // directly. Only onsave hands the draft to the parent.
  import { tick, untrack } from 'svelte';
  import { ROLES } from '../rules.js';

  interface Props {
    member: { nickname: string; role: string };
    // onsave gets the draft and returns null when saved, or text saying why not.
    onsave: (changes: { nickname: string; role: string }) => string | null;
    oncancel: () => void;
  }

  let { member, onsave, oncancel }: Props = $props();

  // The draft starts as a copy of the member. untrack() says "read member once,
  // on purpose": the draft shouldn't follow later changes. App wraps this form
  // in {#key}, so editing someone else makes a fresh form (and a fresh draft).
  let nickname = $state(untrack(() => member.nickname));
  let role = $state(untrack(() => member.role));
  let error = $state(null);
  let nicknameInput;

  // When the form appears, put the cursor in the first field.
  $effect(() => {
    nicknameInput.focus();
  });

  async function handleSubmit(event) {
    event.preventDefault(); // stay on the page instead of reloading it
    // Clear first, so the same error twice is still announced the second time.
    error = null;
    await tick();
    error = onsave({ nickname, role });
    if (error !== null) {
      await tick(); // let aria-invalid and aria-describedby land first
      nicknameInput.focus(); // the first (and only) field that can be wrong
    }
  }
</script>

<form onsubmit={handleSubmit} novalidate>
  <div class="field">
    <label for="nickname">Nickname <span class="hint">(1–12 characters)</span></label>
    <input
      id="nickname"
      type="text"
      autocomplete="off"
      bind:value={nickname}
      bind:this={nicknameInput}
      aria-invalid={error !== null}
      aria-describedby={error !== null ? 'nickname-error' : undefined}
    />
    <!-- Always in the page, so a screen reader is already listening when text appears. -->
    <p id="nickname-error" class="error" aria-live="assertive">{error ?? ''}</p>
  </div>

  <fieldset>
    <legend>Role</legend>
    {#each ROLES as option (option)}
      <label class="choice">
        <input type="radio" name="role" value={option} bind:group={role} />
        {option}
      </label>
    {/each}
  </fieldset>

  <div class="actions">
    <button type="submit" class="primary">Save</button>
    <button type="button" onclick={oncancel}>Cancel</button>
  </div>
</form>

<style>
  form {
    display: grid;
    gap: 1rem;
    background: var(--card);
    border: 2px solid var(--ink);
    border-radius: var(--radius);
    padding: 1.25rem;
  }

  .field {
    display: grid;
    gap: 0.3rem;
    max-width: 22rem;
  }

  label {
    font-weight: 600;
  }

  .hint {
    font-weight: 400;
    color: var(--ink-soft);
  }

  /* Empty but still on the page (no display: none), so the live region is ready to announce. */
  .error:empty {
    min-height: 0;
    margin: 0;
    padding: 0;
    border: 0;
  }

  fieldset {
    border: 2px solid var(--line);
    border-radius: var(--radius);
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem 1.5rem;
  }

  legend {
    font-weight: 600;
    padding-inline: 0.3rem;
  }

  .choice {
    font-weight: 400;
    text-transform: capitalize;
  }

  .actions {
    display: flex;
    gap: 0.75rem;
  }
</style>
