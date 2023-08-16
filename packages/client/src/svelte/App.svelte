<script lang="ts">
  import { onMount } from "svelte"
  import { setup } from "../mud/setup"
  import {
    createComponentSystem,
    createSyncProgressSystem,
  } from "./modules/systems"
  import { network, ready, initBlockListener } from "./modules/network"
  import {
    entities,
    playerCore,
    claims,
    cores,
    playerEntityId,
    ports,
    playerCorePorts,
  } from "./modules/state"
  import { filterByNamespace } from "./modules/utils/misc"
  import { initActionSequencer } from "./modules/action/actionSequencer"
  import { initUI } from "./modules/ui/events"
  // import { initStaticContent } from "./modules/staticContent"

  import Loading from "./components/Loading/Loading.svelte"
  import Spawn from "./components/Spawn/Spawn.svelte"
  import Box from "./components/Box/Box.svelte"
  import End from "./components/End/End.svelte"
  import Toasts from "./components/Toast/Toasts.svelte"
  // import Game from "./components/Game/Game.svelte"

  // - - - - -
  $: console.log("$entities", $entities)
  $: console.log("$claims", $claims)
  $: console.log("$cores", $cores)
  $: console.log("$network", $network)
  $: console.log("$playerCore", $playerCore)
  $: console.log("$playerEntityId", $playerEntityId)
  $: console.log("$ports", $ports)
  $: console.log("$playerCorePorts", $playerCorePorts)
  // - - - - -

  let UIState = 0

  initUI()

  onMount(async () => {
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
  })
</script>

<main>
  <!-- <svelte:component this={selected.component} /> -->

  {#if !$ready || UIState === 0}
    <Loading on:next={() => (UIState = 1)} />
  {:else if !$playerCore}
    <Spawn />
  {:else if $playerCore.level === 6}
    <End />
  {:else}
    <Box />
  {/if}
</main>

<Toasts />
