<script lang="ts">
  import { onMount } from "svelte"
  import { onKeyDown } from "./modules/ui/events"
  import { showGraph } from "./modules/ui/stores"
  import Terminal from "./components/Terminal/Terminal.svelte"
  import Graph from "./components/Graph/Graph.svelte"

  onMount(async () => {
    document.querySelector(".preloader")?.remove()
  })
</script>

<svelte:window on:keydown={onKeyDown} />

<main>
  <!-- <svelte:component this={selected.component} /> -->

  <div class="warning">
    <div class="warning-message">
      ### THIS CURSED MACHINE ###<br /><br />This machine has cursed all mobile
      devices.<br />
      Come back with a real computer.
    </div>
  </div>

  <Terminal on:show={() => ($showGraph = true)} />

  {#if $showGraph}
    <div class="graph-container">
      <Graph id="machines" />
    </div>
  {/if}
</main>

<!-- <Toasts /> -->

<style>
  .warning {
    position: fixed;
    inset: 0;
    color: var(--terminal-color);
    background: var(--terminal-background);
    z-index: 99999999;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .warning-message {
    padding: 1rem;
    border: var(--terminal-border);
  }

  .graph-container {
    position: fixed;
    /* background: red; */
    inset: 0;
    z-index: 999;
    background: rgba(0, 0, 0, 0.8);
  }

  @media screen and (min-width: 768px) {
    .warning {
      display: none;
    }
  }
</style>
