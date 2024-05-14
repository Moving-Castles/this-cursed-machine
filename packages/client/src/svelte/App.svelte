<script lang="ts">
  import { onMount } from "svelte"
  import { tutorialProgress } from "@modules/ui/assistant"
  import { FINAL_TUTORIAL_LEVEL } from "@modules/ui/constants"
  import { ENVIRONMENT } from "@mud/enums"
  import { FullStory, init as initFullstory } from "@fullstory/browser"

  import { initStaticContent } from "@modules/content"
  import { initSound } from "@modules/sound"
  import { clearTerminalOutput } from "@components/Main/Terminal/functions/helpers"
  import { UIState, mouseX, mouseY } from "@modules/ui/stores"
  import { UI } from "@modules/ui/enums"
  import { playSound } from "@modules/sound"
  import { player, playerAddress } from "@modules/state/base/stores"

  import Loading from "@components/Loading/Loading.svelte"
  import Spawn from "@components/Spawn/Spawn.svelte"
  import Main from "@components/Main/Main.svelte"
  import Tutorial from "@components/Tutorial/Tutorial.svelte"
  import TutorialCompleted from "@components/Tutorial/TutorialCompleted.svelte"
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

    // Register the user in fullstory
    FullStory("setIdentity", {
      uid: $playerAddress,
      properties: {
        displayName: $player.name,
      },
    })

    UIState.set(UI.READY)
  }

  const escaped = () => {
    UIState.set(UI.ESCAPED)
  }

  onMount(async () => {
    // Remove preloader
    document.querySelector(".preloader")?.remove()

    // Get static content from CMS
    initStaticContent()

    // Preload sounds
    initSound()

    introSound = playSound("tcm", "introBg", true, true)

    // Fullstory analytics
    initFullstory({
      orgId: "o-1RP0ZA-na1",
      debug: true,
    })

    if ($UIState === UI.READY) {
      FullStory("setIdentity", {
        uid: $playerAddress,
        properties: {
          displayName: $player.name,
        },
      })
    }
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

<svelte:document on:visibilitychange={initStaticContent} />

<main>
  {#if $UIState === UI.LOADING}
    <Loading {environment} on:done={loaded} />
  {/if}

  {#if $UIState === UI.SPAWNING}
    <Spawn {environment} on:done={spawned} on:escaped={escaped} />
  {/if}

  {#if $UIState === UI.READY}
    {#if $tutorialProgress !== FINAL_TUTORIAL_LEVEL}
      <Main on:escaped={escaped} />
      <Tutorial />
    {:else}
      <TutorialCompleted />
    {/if}
  {/if}
</main>

<MobileWarning />

<Toasts />
<Assistant />
