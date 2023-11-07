<script lang="ts">
  import { onMount, onDestroy } from "svelte"
  import { writable } from "svelte/store"
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
  import { restart as sendRestart } from "./modules/action"
  import { localLevel } from "./modules/ui/stores"
  import { clearTerminalOutput } from "./components/Terminal/functions/helpers"
  import { UIState, UI, mouseX, mouseY } from "./modules/ui/stores"
  import { playSound } from "./modules/sound"

  import Loading from "./components/Loading/Loading.svelte"
  import Spawn from "./components/Spawn/Spawn.svelte"
  import TerminalBox from "./components/Box/TerminalBox.svelte"
  import Death from "./components/Death/Death.svelte"
  import Completed from "./components/Completed/Completed.svelte"
  import Toasts from "./components/Toast/Toasts.svelte"

  const onMouseMove = e => {
    $mouseX = e.clientX
    $mouseY = e.clientY
  }

  let unsubscribe: ReturnType<typeof writable>
  let introSound: Howl | undefined

  const restart = () => {
    clearTerminalOutput()
    localLevel.set(0)
    sendRestart()
    UIState.set(UI.LOADING)
  }

  const dead = () => {
    UIState.set(UI.DEAD)
  }

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
    unsubscribe = initStateSimulator()

    // Preload sounds
    initSound()

    introSound = playSound("tcm", "introBg", true, true)
  })

  onDestroy(unsubscribe)

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
    <TerminalBox on:dead={dead} on:completed={completed} />
  {/if}

  {#if $UIState === UI.DEAD}
    <Death on:restart={restart} />
  {/if}

  {#if $UIState === UI.COMPLETED}
    <Completed />
  {/if}
</main>

<Toasts />
