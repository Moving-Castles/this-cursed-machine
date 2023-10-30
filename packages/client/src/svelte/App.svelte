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
  import {
    localLevel,
    showLevelModal,
    lastCompletedBlock,
  } from "./modules/ui/stores"
  import { recipes } from "./modules/state"
  import { clearTerminalOutput } from "./components/Terminal/functions/helpers"
  import { patches } from "./modules/simulator"
  import { blockNumber } from "./modules/network"
  import { getUniqueIdentifier } from "./modules/utils/misc"

  // $: console.log("$patches", $patches)
  // $: console.log("$showLevelModal", $showLevelModal)
  // $: if ($showLevelModal) {
  //   console.log("show level modal true => $localLevel", $localLevel)
  // }
  // $: console.log(
  //   "$recipes",
  //   Object.entries($recipes).filter(([key, value]) => value.machineType === 5)
  // )

  console.log(
    "getUniqueIdentifier 1",
    getUniqueIdentifier(Number(MaterialType.PISS), Number(MaterialType.MONSTER))
  )

  console.log(
    "getUniqueIdentifier 2",
    getUniqueIdentifier(Number(MaterialType.MONSTER), Number(MaterialType.PISS))
  )
  // $: console.log("$blockNumber", $blockNumber, "$lastCompletedBlock", $lastCompletedBlock, "difference", $blockNumber - $lastCompletedBlock)

  import Loading from "./components/Loading/Loading.svelte"
  import Spawn from "./components/Spawn/Spawn.svelte"
  import TerminalBox from "./components/Box/TerminalBox.svelte"
  import Death from "./components/Death/Death.svelte"
  import Toasts from "./components/Toast/Toasts.svelte"
  import { MaterialType } from "./modules/state/enums"

  enum UI {
    LOADING,
    SPAWNING,
    DEAD,
    READY,
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
    <Spawn on:done={spawned} />
  {/if}

  {#if UIState === UI.READY}
    <TerminalBox on:dead={dead} />
  {/if}

  {#if UIState === UI.DEAD}
    <Death on:restart={restart} />
  {/if}
</main>

<Toasts />
