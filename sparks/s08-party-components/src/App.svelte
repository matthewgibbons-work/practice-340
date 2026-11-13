<script>
  // App is just the page: the banner, the panels, and the link home.
  // The party itself lives in PartyList.
  import Panel from './Panel.svelte';
  import PartyList from './PartyList.svelte';
</script>

<main>
  <div class="banner">
    <p class="kicker">Trainer party</p>
    <h1>My party</h1>
  </div>

  <Panel title="Party members">
    <PartyList />
  </Panel>

  <p class="back"><a href="../../">Back to the hub</a></p>
</main>

<style>
  /* A warm trainer-card palette. Tokens on :root so every component
     (and the page behind them) uses the same colors. */
  :global(:root) {
    --bg: #fff8ee;
    --surface: #ffffff;
    --text: #2b1d16;
    --muted: #6b4f3f;
    --accent: #b3261e;
    --accent-soft: #ffe1d6;
    --border: #e7c9b5;
  }

  :global(body) {
    margin: 0;
    background: var(--bg);
    color: var(--text);
    font-family: system-ui, sans-serif;
    line-height: 1.5;
  }

  main {
    max-width: 52rem;
    margin: 0 auto;
    padding: 1.5rem 1rem 2rem;
  }

  /* The red band at the top, with rounded corners like a card. */
  .banner {
    padding: 1.25rem 1.5rem;
    background: var(--accent);
    color: #ffffff;
    border-radius: 1rem;
  }

  .kicker {
    margin: 0;
    color: var(--accent-soft);
    font-size: 0.875rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  h1 {
    margin: 0;
    font-size: 2.25rem;
    line-height: 1.2;
  }

  a {
    color: var(--accent);
  }

  a:focus-visible {
    outline: 3px solid var(--text);
    outline-offset: 2px;
  }

  .back a {
    display: inline-block;
    padding-block: 0.25rem;
  }
</style>
