<script lang="ts">
  // The layout component: a <section> named by its own heading.
  // `children` is whatever the parent puts between <Panel> and </Panel>.
  import type { Snippet } from 'svelte';

  // Types for the props: id and title are text; children is a Snippet
  // (a chunk of markup the parent hands in to be drawn here).
  interface Props {
    id: string;
    title: string;
    children: Snippet;
  }

  let { id, title, children }: Props = $props();
</script>

<section class="panel" aria-labelledby={id}>
  <!-- tabindex="-1" lets the page move focus here (after a remove) without adding a Tab stop. -->
  <h2 {id} tabindex="-1">{title}</h2>
  {@render children()}
</section>

<style>
  .panel {
    margin-block: 2rem;
  }

  h2 {
    font-size: 1.4rem;
    margin: 0 0 0.75rem;
    padding-bottom: 0.35rem;
    border-bottom: 3px double var(--line);
  }
</style>
