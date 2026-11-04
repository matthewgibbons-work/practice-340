<script>
  import PokemonCard from './PokemonCard.svelte';
</script>

<main>
  <h1>Trainer card</h1>
  <PokemonCard name="Charmander" startLevel={12} evolvesAt={16} evolvesInto="Charmeleon" />
  <p><a href="../../">Back to the hub</a></p>
</main>

<style>
  main {
    font-family: system-ui, sans-serif;
    line-height: 1.5;
    max-width: 40rem;
    margin: 0 auto;
    padding: 1rem;
  }
</style>
