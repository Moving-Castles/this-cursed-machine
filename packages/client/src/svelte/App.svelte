<script lang="ts">
  import { onMount } from "svelte"
  import { setup } from "../mud/setup"
  import { createComponentSystem, createLoadingStateSystem } from "./systems"
  import { network, ready, initBlockListener } from "./modules/network"
  import { entities, playerCore } from "./modules/state"
  import { initActionSequencer } from "./modules/action/actionSequencer"
  import { initUI } from "./modules/ui/events"
  // import { initStaticContent } from "./modules/staticContent"

  import Loading from "./components/Loading/Loading.svelte"
  import Spawn from "./components/Spawn/Spawn.svelte"
  import Game from "./components/Game/Game.svelte"
  import Toasts from "./components/Toast/Toasts.svelte"

  // - - - - -
  $: console.log("$entities", $entities)
  $: console.log("$network", $network)
  $: console.log($playerCore)
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

    // Create systems to listen to changes to defined component
    for (const componentKey of Object.keys($network.contractComponents)) {
      createComponentSystem(componentKey)
    }

    // Listen to changes to the LoadingState component
    createLoadingStateSystem()
  })
    
</script>

<main>
  {#if !$ready || UIState === 0}
    <Loading on:next={() => (UIState = 1)} />
  {:else if !$playerCore}
    <Spawn />
  {:else if $playerCore.realmId === 0}
    <Game />
  {:else if $playerCore.realmId === 1}
    THE VOID
  {/if}
</main>

<Toasts />
