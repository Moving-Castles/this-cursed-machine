<script lang="ts">
  import { onMount } from "svelte"
  import { setupPublicNetwork } from "@mud/setupPublicNetwork"
  import { ENVIRONMENT } from "@mud/enums"
  import {
    createComponentSystem,
    createSyncProgressSystem,
  } from "@modules/systems"
  import {
    publicNetwork,
    walletNetwork,
    initBlockListener,
  } from "@modules/network"
  $: console.log("$walletNetwork", $walletNetwork)
  $: console.log("$publicNetwork", $publicNetwork)

  import { initActionSequencer } from "@modules/action/actionSequencer"
  import { initStateSimulator } from "@modules/state/resolver"
  import { initStaticContent } from "@modules/content"
  import { initSound } from "@modules/sound"
  import { clearTerminalOutput } from "@components/Main/Terminal/functions/helpers"
  import { UIState, mouseX, mouseY } from "@modules/ui/stores"
  import { UI } from "@modules/ui/enums"
  import { playSound } from "@modules/sound"

  import {
    player,
    playerAddress,
    entities,
    players,
  } from "@modules/state/base/stores"
  $: console.log("$player", $player)
  $: console.log("$playerAddress", $playerAddress)
  $: console.log("$entities", $entities)
  $: console.log("$players", $players)

  import Loading from "@components/Loading/Loading.svelte"
  import Spawn from "@components/Spawn/Spawn.svelte"
  import Main from "@components/Main/Main.svelte"
  import Tutorial from "@components/Tutorial/Tutorial.svelte"
  import Toasts from "@modules/ui/toast/Toasts.svelte"
  import Assistant from "@modules/ui/assistant/Assistant.svelte"
  import MobileWarning from "@components/Main/MobileWarning.svelte"

  export let environment: ENVIRONMENT

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

  onMount(async () => {
    // Output console message
    // messageToStumps()

    // Remove preloader
    document.querySelector(".preloader")?.remove()

    // Get static content from CMS
    initStaticContent()

    // Write mud layer to svelte store
    const mudLayer = await setupPublicNetwork(environment)
    publicNetwork.set(mudLayer)

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
    <Spawn {environment} on:done={spawned} on:escaped={escaped} />
  {/if}

  {#if $UIState === UI.READY}
    <Main on:escaped={escaped} />
    <Tutorial />
  {/if}
</main>

<MobileWarning />

<Toasts />
<Assistant />
