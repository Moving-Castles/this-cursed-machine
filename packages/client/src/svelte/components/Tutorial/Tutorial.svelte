<script lang="ts">
  // This file is responsible for the tutorial notifications and for checking tutorial progress
  // Messages are sent to the <Assistant /> component in App.svelte
  import { onMount } from "svelte"
  import { player } from "@modules/state/base/stores"
  import { discoveredMaterials } from "@modules/state/simulated/stores"
  import {
    sendMessage,
    clearMessage,
    tutorialProgress,
    currentMessage,
    currentCondition,
    initTutorial,
    advanceTutorial,
    advanceConditions,
  } from "@modules/ui/assistant"

  $: {
    if (typeof $tutorialProgress === "number" && $currentMessage?.explanation) {
      sendMessage($currentMessage.explanation)
    } else if ($tutorialProgress && !$currentMessage?.explanation) {
      clearMessage()
    }
  }

  $: {
    const step = $advanceConditions?.[$tutorialProgress]
    if (step) {
      currentCondition.set(step)
    }
  }

  $: {
    if ($currentCondition) {
      if ($currentCondition.type === "wait") {
        setTimeout(() => {
          advanceTutorial(null, $tutorialProgress, "wait")
        }, $currentCondition.value)
      }
    }
  }

  onMount(() => {
    initTutorial()

    if ($currentMessage?.explanation) {
      sendMessage($currentMessage.explanation)
    }
  })
</script>

{#if import.meta.env.DEV && $player}
  <div class="test">
    <button on:click={() => $tutorialProgress--}>Prev</button>
    <button on:click={() => $tutorialProgress++}>Next</button>
    <button
      on:click={() => {
        $tutorialProgress = 0
        clearMessage()
      }}
    >
      Reset
    </button>
    <button
      on:click={() => {
        discoveredMaterials.set(["0x745f425547530000000000000000"])
      }}
    >
      Reset discoveries
    </button>

    {$player.tutorialLevel}
    {typeof $tutorialProgress}
    {$tutorialProgress}
  </div>
{/if}

<style>
  .test {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: var(--z-1);
    background: var(--color-grey-mid);
  }
</style>
