<script lang="ts">
  import { onMount } from "svelte"
  import { setup } from "../mud/setup"
  import {
    createComponentSystem,
    createSyncProgressSystem,
  } from "./modules/systems"
  import { network, initBlockListener } from "./modules/network"
  import { playerCore } from "./modules/state"
  import { filterByNamespace } from "./modules/utils/misc"
  import { initActionSequencer } from "./modules/action/actionSequencer"
  import { onKeyDown } from "./modules/ui/events"
  import { initStateSimulator } from "./modules/simulator/networkResolver"

  import Terminal from "./components/Terminal/Terminal.svelte"
  import Graph from "./components/Graph/Graph.svelte"

  // - - - - -
  // $: console.log("$entities", $entities)
  // $: console.log("$cores", $cores)
  // $: console.log("$network", $network)
  // $: console.log("$playerCore", $playerCore)
  // $: console.log("$ports", $ports)
  // $: console.log("$simulated", $simulated)
  // $: console.log("$patches", $patches)
  // $: console.log("$blocksSinceLastResolution", $blocksSinceLastResolution)
  // - - - - -

  onMount(async () => {
    document.querySelector(".preloader")?.remove()
    // Get static content from CMS
    // initStaticContent()
    // Write mud layer to svelte store
    const mudLayer = await setup()
    network.set(mudLayer)
    // Modules responsible for sending transactions
    initActionSequencer()
    // Write block numbers to svelte store and alert on lost connection
    initBlockListener()
    // Create systems to listen to changes to components in our own namespace
    for (const componentKey of Object.keys(
      filterByNamespace($network.components, "mc")
    )) {
      createComponentSystem(componentKey)
    }
    // Listen to changes to the SyncProgresscomponent
    createSyncProgressSystem()
    // Simulate state changes
    initStateSimulator()
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

  {#if $playerCore}
    <div class="graph-container">
      <Graph id="machines" />
    </div>
  {/if}

  <div class="terminal-container">
    <Terminal
      sequence={[
        `‡ can you hear me?
‡ ???
‡ I think you should be able to hear me…
>>>....
      `,
        "Welcome to your new body",
      ]}
      stage={false}
    />
  </div>
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

  .terminal-container {
    height: 100dvh;
  }

  .graph-container {
    height: 100dvh;
    width: 100dvw;
    background: black;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10000;
    overflow: hidden;
  }

  .warning-message {
    padding: 1rem;
    border: var(--terminal-border);
  }

  @media screen and (min-width: 768px) {
    .warning {
      display: none;
    }
  }
</style>
