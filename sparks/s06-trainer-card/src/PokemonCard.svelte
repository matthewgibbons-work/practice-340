<script>
  import { untrack } from 'svelte';

  // Props: what App tells this card about the Pokémon.
  const { name, startLevel, evolvesAt, evolvesInto } = $props();

  const MIN_LEVEL = 1;
  const MAX_LEVEL = 100;

  // $state: the one value that changes. Svelte redraws whatever reads it.
  // It starts at startLevel, then the buttons own it. untrack says "I only
  // want startLevel's first value on purpose", which is what Svelte warns about.
  let level = $state(untrack(() => startLevel));

  // $derived: worked out from level, so it can never be out of step with it.
  const levelsToEvolve = $derived(evolvesAt - level);

  // Three cases: still to go, exactly one level, or already past it.
  const evolveMessage = $derived(
    levelsToEvolve > 1
      ? `${levelsToEvolve} levels until it evolves into ${evolvesInto}.`
      : levelsToEvolve === 1
        ? `One more level and it evolves into ${evolvesInto}!`
        : `Ready to evolve into ${evolvesInto}.`,
  );

  // Math.min / Math.max keep the level inside 1–100. The buttons stay enabled
  // at the limits, so keyboard focus never gets thrown off a disabled button.
  const levelUp = () => {
    level = Math.min(level + 1, MAX_LEVEL);
  };
  const levelDown = () => {
    level = Math.max(level - 1, MIN_LEVEL);
  };
</script>

<article aria-labelledby="card-name">
  <h2 id="card-name">{name}</h2>
  <!-- aria-live: a screen reader reads the new level and message after each press. -->
  <div aria-live="polite">
    <p class="level">Level {level}</p>
    <p>{evolveMessage}</p>
  </div>
  <div class="buttons">
    <button type="button" onclick={levelUp}>Level up {name}</button>
    <button type="button" onclick={levelDown}>Level down {name}</button>
  </div>
</article>

<style>
  article {
    border: 1px solid #8888;
    border-radius: 0.5rem;
    padding: 1rem;
  }

  h2 {
    margin: 0;
  }

  .level {
    font-size: 1.5rem;
    font-weight: bold;
    margin: 0.25rem 0;
  }

  .buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  button {
    font: inherit;
    padding: 0.25rem 0.75rem;
  }
</style>
