<script lang="ts">
  import { onMount } from "svelte"
  import { setup } from "../mud/setup"
  import {
    createComponentSystem,
    createSyncProgressSystem,
  } from "./modules/systems"
  import { network, ready, initBlockListener } from "./modules/network"
  import { entities, playerCore, cores, ports } from "./modules/state"
  // import {
  //   patches,
  //   simulated,
  //   blocksSinceLastResolution,
  // } from "./modules/simulator"
  import { filterByNamespace } from "./modules/utils/misc"
  import { initActionSequencer } from "./modules/action/actionSequencer"
  import { initUI, onKeyDown } from "./modules/ui/events"
  import { initStateSimulator } from "./modules/simulator/networkResolver"
  import { initStaticContent } from "./modules/content"

  import Loading from "./components/Loading/Loading.svelte"
  import Flash from "./components/Flash/Flash.svelte"
  import Spawn from "./components/Spawn/Spawn.svelte"
  import TerminalBox from "./components/Box/TerminalBox.svelte"
  import End from "./components/End/End.svelte"
  import Toasts from "./components/Toast/Toasts.svelte"

  // import Game from "./components/Game/Game.svelte"
  // import Box from "./components/Box/Box.svelte"

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

  let UIState = 0

  initUI()

  onMount(async () => {
    // Remove preloader
    document.querySelector(".preloader")?.remove()

    // Get static content from CMS
    await initStaticContent()

    // Write mud layer to svelte store
    const mudLayer = await setup()
    network.set(mudLayer)

    // Modules responsible for sending transactions
    initActionSequencer()

    // Write block numbers to svelte store and alert on lost connection
    initBlockListener()

    // Create systems to listen to changes to components in our namespace
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

  {#if !$ready || UIState === 0}
    <Loading on:next={() => (UIState = 1)} />
  {:else if UIState === 1}
    <Flash on:next={() => (UIState = 2)} />
  {:else if !$playerCore}
    <Spawn />
  {:else if $playerCore.level === 6}
    <End />
  {:else}
    <TerminalBox />
  {/if}
</main>

<Toasts />

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

  @media screen and (min-width: 768px) {
    .warning {
      display: none;
    }
  }
</style>
