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
  import { initSound } from "./modules/sound"
  import { clearTerminalOutput } from "./components/Terminal/functions/helpers"
  import { UIState, UI, mouseX, mouseY } from "./modules/ui/stores"
  import { messageToStumps } from "./modules/ui"
  import { playSound } from "./modules/sound"

  import Loading from "./components/Loading/Loading.svelte"
  import Spawn from "./components/Spawn/Spawn.svelte"
  import Pod from "./components/Pod/Pod.svelte"
  import Naming from "./components/Naming/Naming.svelte"
  import Toasts from "./modules/ui/toast/Toasts.svelte"

  const onMouseMove = e => {
    $mouseX = e.clientX
    $mouseY = e.clientY
  }

  let introSound: Howl | undefined

  const loaded = () => {
    UIState.set(UI.SPAWNING)
  }

  const spawned = () => {
    clearTerminalOutput()
    UIState.set(UI.READY)
  }

  const completed = () => {
    clearTerminalOutput()
    UIState.set(UI.COMPLETED)
  }

  const named = () => {
    clearTerminalOutput()
    UIState.set(UI.NAMED)
  }

  onMount(async () => {
    // Output console message
    messageToStumps()

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
    for (const componentKey of mudLayer.tableKeys) {
      createComponentSystem(componentKey)
    }

    // Listen to changes to the SyncProgresscomponent
    createSyncProgressSystem()

    // createTokenBalancesSystem()

    // Simulate state changes
    initStateSimulator()

    // Preload sounds
    initSound()

    introSound = playSound("tcm", "introBg", true, true)
  })

  // Fade out intro sound when ready
  $: if ($UIState === UI.READY) {
    if (introSound) {
      introSound.fade(1, 0, 1000)
      setTimeout(() => {
        introSound?.stop()
      }, 1000)
    }
  }
</script>

<svelte:window on:mousemove={onMouseMove} />

<main>
  {#if $UIState === UI.LOADING}
    <Loading on:done={loaded} />
  {/if}

  {#if $UIState === UI.SPAWNING}
    <Spawn on:done={spawned} on:completed={completed} />
  {/if}

  {#if $UIState === UI.READY}
    <Pod on:completed={completed} />
  {/if}

  {#if $UIState === UI.COMPLETED}
    <Naming on:named={named} />
  {/if}
</main>

<Toasts />
