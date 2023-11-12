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
  import { restart as sendRestart } from "./modules/action"
  import { localLevel } from "./modules/ui/stores"
  import { clearTerminalOutput } from "./components/Terminal/functions/helpers"
  import { UIState, UI, mouseX, mouseY } from "./modules/ui/stores"
  import { messageToStumps } from "./modules/ui"
  import { playSound } from "./modules/sound"

  import Loading from "./components/Loading/Loading.svelte"
  import Spawn from "./components/Spawn/Spawn.svelte"
  import TerminalBox from "./components/Box/TerminalBox.svelte"
  import Death from "./components/Death/Death.svelte"
  import Dashboard from "./components/Dashboard/Dashboard.svelte"
  import Naming from "./components/Naming/Naming.svelte"
  import Toasts from "./components/Toast/Toasts.svelte"

  const onMouseMove = e => {
    $mouseX = e.clientX
    $mouseY = e.clientY
  }

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

  const named = () => {
    clearTerminalOutput()
    UIState.set(UI.NAMED)
  }

  const dashboard = () => {
    const urlParams = new URLSearchParams(new URL(window.location.href).search)
    if (urlParams.get("dashboard") !== null) {
      UIState.set(UI.DASHBOARD)
    }
  }

  onMount(async () => {
    // Output console message
    messageToStumps()

    //Check if we should skip to the dashboard
    dashboard()

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
    for (const componentKey of Object.keys($network.components)) {
      createComponentSystem(componentKey)
    }

    // Listen to changes to the SyncProgresscomponent
    createSyncProgressSystem()

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
    <TerminalBox on:dead={dead} on:completed={completed} />
  {/if}

  {#if $UIState === UI.COMPLETED}
    <Naming on:named={named} />
  {/if}

  {#if $UIState === UI.NAMED || $UIState === UI.DASHBOARD}
    <Dashboard />
  {/if}

  {#if $UIState === UI.DEAD}
    <Death on:restart={restart} />
  {/if}
</main>

<Toasts />
