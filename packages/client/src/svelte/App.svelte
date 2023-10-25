<script lang="ts">
  import { onMount } from "svelte"
  import { setup } from "../mud/setup"
  import {
    createComponentSystem,
    createSyncProgressSystem,
  } from "./modules/systems"
  import { network, ready, initBlockListener } from "./modules/network"
  import { playerCore, recipes, goals, materials } from "./modules/state"
  import {
    simulatedMaterials,
    simulatedPlayerEnergy,
    patches,
  } from "./modules/simulator"
  // import {
  //   queuedActions,
  //   activeActions,
  //   completedActions,
  // } from "./modules/action/actionSequencer"
  // import { filterByNamespace } from "./modules/utils/misc"
  import { initActionSequencer } from "./modules/action/actionSequencer"
  import { initUI, onKeyDown } from "./modules/ui/events"
  import { initStateSimulator } from "./modules/simulator/networkResolver"
  import { initStaticContent } from "./modules/content"
  import { initSound, playSound } from "./modules/sound"

  import Loading from "./components/Loading/Loading.svelte"
  import Spawn from "./components/Spawn/Spawn.svelte"
  import TerminalBox from "./components/Box/TerminalBox.svelte"
  import Toasts from "./components/Toast/Toasts.svelte"
  import Death from "./components/Death/Death.svelte"

  // - - - - -
  // $: console.log("$staticContent", $staticContent)
  // $: console.log("$patches", $patches)
  // $: console.log("$goals", $goals)
  // $: console.log("$materials", $materials)
  // $: console.log("$recipes", $recipes)
  // $: console.log("$activeActions", $activeActions)
  // $: console.log("$queuedActions", $queuedActions)
  // $: console.log("$completedActions", $completedActions)
  // $: console.log("$entities", $entities)
  // $: console.log("$levels", $levels)
  // $: console.log("$cores", $cores)
  // $: console.log("$network", $network)
  // $: console.log("$playerCore", $playerCore)
  // $: console.log("$ports", $ports)
  // $: console.log("$simulated", $simulated)
  // $: console.log("$blocksSinceLastResolution", $blocksSinceLastResolution)
  // - - - - -

  let UIState = 0

  initUI()

  onMount(async () => {
    // Remove preloader
    document.querySelector(".preloader")?.remove()

    // Get static content from CMS
    initStaticContent()

    // Write mud layer to svelte store
    const mudLayer = await setup()
    network.set(mudLayer)

    // Modules responsible for sending transactions
    initActionSequencer()

    // Write block numbers to svelte store and alert on lost connection
    initBlockListener()

    // Create systems to listen to changes to components in our namespace
    // filterByNamespace($network.components, "mc")
    for (const componentKey of Object.keys($network.components)) {
      createComponentSystem(componentKey)
    }

    // Listen to changes to the SyncProgresscomponent
    createSyncProgressSystem()

    // Simulate state changes
    initStateSimulator()

    // Preload sounds
    initSound()

    playSound("tcm", "inner", true, false)
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
  {:else if $playerCore?.level == undefined || $playerCore?.level === 0}
    <Spawn />
  {:else if $simulatedPlayerEnergy === 0}
    <Death />
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
