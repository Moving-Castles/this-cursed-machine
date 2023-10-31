<script lang="ts">
  import { onMount } from "svelte"
  import { setup } from "../mud/setup"
  import {
    createComponentSystem,
    createSyncProgressSystem,
  } from "./modules/systems"
  import { network, initBlockListener } from "./modules/network"
  import { initActionSequencer } from "./modules/action/actionSequencer"
  import { initStateSimulator } from "./modules/simulator/networkResolver"
  import { initStaticContent } from "./modules/content"
  import { initSound, playSound } from "./modules/sound"
  import { restart as sendRestart } from "./modules/action"
  import { localLevel } from "./modules/ui/stores"
  import { clearTerminalOutput } from "./components/Terminal/functions/helpers"
  import { playerCore } from "./modules/state"

  import Loading from "./components/Loading/Loading.svelte"
  import Spawn from "./components/Spawn/Spawn.svelte"
  import TerminalBox from "./components/Box/TerminalBox.svelte"
  import Death from "./components/Death/Death.svelte"
  import Completed from "./components/Completed/Completed.svelte"
  import Toasts from "./components/Toast/Toasts.svelte"

  $: console.log("$playerCore", $playerCore)

  enum UI {
    LOADING,
    SPAWNING,
    DEAD,
    READY,
    COMPLETED,
  }

  let UIState = UI.LOADING

  const restart = () => {
    clearTerminalOutput()
    localLevel.set(0)
    sendRestart()
    UIState = UI.LOADING
  }

  const dead = () => {
    UIState = UI.DEAD
  }

  const loaded = () => {
    UIState = UI.SPAWNING
  }

  const spawned = () => {
    clearTerminalOutput()
    UIState = UI.READY
  }

  const completed = () => {
    clearTerminalOutput()
    UIState = UI.COMPLETED
  }

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

<main>
  {#if UIState === UI.LOADING}
    <Loading on:done={loaded} />
  {/if}

  {#if UIState === UI.SPAWNING}
    <Spawn on:done={spawned} on:completed={completed} />
  {/if}

  {#if UIState === UI.READY}
    <TerminalBox on:dead={dead} on:completed={completed} />
  {/if}

  {#if UIState === UI.DEAD}
    <Death on:restart={restart} />
  {/if}

  {#if UIState === UI.COMPLETED}
    <Completed />
  {/if}
</main>

<Toasts />
