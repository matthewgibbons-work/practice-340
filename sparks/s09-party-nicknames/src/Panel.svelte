<script lang="ts">
  import type { Snippet } from 'svelte';

  // title: the heading text, a string.
  // children: whatever markup the parent puts between <Panel> and </Panel>.
  interface Props {
    title: string;
    children: Snippet;
  }

  let { title, children }: Props = $props();

  // A unique id for this Panel, so the <section> can point at its own heading.
  const id = $props.id();
</script>

<section class="panel" aria-labelledby={id}>
  <h2 {id}>{title}</h2>
  {@render children()}
</section>

<style>
  .panel {
    margin-top: 1.5rem;
  }

  h2 {
    margin: 0;
    color: var(--muted);
    font-size: 0.875rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
</style>
