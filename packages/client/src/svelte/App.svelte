<script lang="ts">
  import { onMount } from "svelte"
  import { setup } from "@mud/setup"
  import { ENVIRONMENT } from "@mud/enums"
  import {
    createComponentSystem,
    createSyncProgressSystem,
  } from "@modules/systems"
  import { network, initBlockListener } from "@modules/network"
  import { initActionSequencer } from "@modules/action/actionSequencer"
  import { initStateSimulator } from "@modules/state/resolver"
  import { initStaticContent } from "@modules/content"
  import { initSound } from "@modules/sound"
  import { initSignalNetwork } from "./modules/signal"
  import { clearTerminalOutput } from "@components/Main/Terminal/functions/helpers"
  import { UIState, mouseX, mouseY } from "@modules/ui/stores"
  import { UI } from "@modules/ui/enums"
  import { playSound } from "@modules/sound"

  import { materialMetadata } from "@modules/state/base/stores"

  import Loading from "@components/Loading/Loading.svelte"
  import Spawn from "@components/Spawn/Spawn.svelte"
  import Main from "@components/Main/Main.svelte"
  import Tutorial from "@components/Tutorial/Tutorial.svelte"
  import Toasts from "@modules/ui/toast/Toasts.svelte"
  import Assistant from "@modules/ui/assistant/Assistant.svelte"
  import MobileWarning from "@components/Main/MobileWarning.svelte"

  const onMouseMove = (e: MouseEvent) => {
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

  const escaped = () => {
    UIState.set(UI.ESCAPED)
  }

  const getEnvironment = () => {
    switch (window.location.hostname) {
      case "thiscursedmachine.fun":
        return ENVIRONMENT.REDSTONE
      case "redstone-test.thiscursedmachine.fun":
        return ENVIRONMENT.REDSTONE_TEST
      case "garnet-wallet.thiscursedmachine.fun":
        return ENVIRONMENT.GARNET_WALLET
      case "garnet.thiscursedmachine.fun":
        return ENVIRONMENT.GARNET
      case "rhodolite.thiscursedmachine.fun":
        return ENVIRONMENT.RHODOLITE
      case "old.thiscursedmachine.fun":
        return ENVIRONMENT.OLD_TESTNET
      default:
        return ENVIRONMENT.DEVELOPMENT
    }
  }

  onMount(async () => {
    // Output console message
    // messageToStumps()

    // Determine what chain we should connect to
    const environment = getEnvironment()

    // Remove preloader
    document.querySelector(".preloader")?.remove()

    // Get static content from CMS
    initStaticContent()

    // Write mud layer to svelte store
    const mudLayer = await setup(environment)
    network.set(mudLayer)

    // Modules responsible for sending transactions
    initActionSequencer()

    // Write block numbers to svelte store and alert on lost connection
    initBlockListener()

    // Create systems to listen to changes to game-specific tables
    for (const componentKey of mudLayer.tableKeys) {
      createComponentSystem(componentKey)
    }

    // Listen to changes to the SyncProgresscomponent
    createSyncProgressSystem()

    // Simulate state changes
    initStateSimulator()

    // Preload sounds
    initSound()

    introSound = playSound("tcm", "introBg", true, true)

    // Signal network
    initSignalNetwork()
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
    <Spawn on:done={spawned} on:escaped={escaped} />
  {/if}

  {#if $UIState === UI.READY}
    <Main on:escaped={escaped} />
    <Tutorial />
  {/if}
</main>

<MobileWarning />

<Toasts />
<Assistant />
