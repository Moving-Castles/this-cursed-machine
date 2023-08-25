<script lang="ts">
  import { onMount } from "svelte"
  import { setup } from "../mud/setup"
  import {
    createComponentSystem,
    createSyncProgressSystem,
  } from "./modules/systems"
  import { network, ready, initBlockListener } from "./modules/network"
  import { entities, playerCore, cores, ports } from "./modules/state"
  import {
    currentOutput,
    simulatedState,
    blocksSinceLastResolution,
  } from "./modules/simulator"
  import { filterByNamespace } from "./modules/utils/misc"
  import { initActionSequencer } from "./modules/action/actionSequencer"
  import { initUI, onKeyDown } from "./modules/ui/events"
  // import { initStaticContent } from "./modules/staticContent"
  import { initStateSimulator } from "./modules/simulator/networkResolver"

  import Loading from "./components/Loading/Loading.svelte"
  import Spawn from "./components/Spawn/Spawn.svelte"
  import TerminalBox from "./components/Box/TerminalBox.svelte"
  import End from "./components/End/End.svelte"
  import Toasts from "./components/Toast/Toasts.svelte"
  // import Game from "./components/Game/Game.svelte"
  // import Box from "./components/Box/Box.svelte"

  // - - - - -
  $: console.log("$entities", $entities)
  $: console.log("$cores", $cores)
  $: console.log("$network", $network)
  $: console.log("$playerCore", $playerCore)
  $: console.log("$ports", $ports)
  $: console.log("$simulatedState", $simulatedState)
  $: console.log("$currentOutput", $currentOutput)
  $: console.log("$blocksSinceLastResolution", $blocksSinceLastResolution)
  // - - - - -

  let UIState = 0

  initUI()

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

  {#if !$ready || UIState === 0}
    <Loading on:next={() => (UIState = 1)} />
  {:else if !$playerCore}
    <Spawn />
  {:else if $playerCore.level === 6}
    <End />
  {:else}
    <TerminalBox />
  {/if}
</main>

<Toasts />
