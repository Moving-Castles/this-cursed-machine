<script lang="ts">
  // This file is responsible for the tutorial notifications and for checking tutorial progress
  // Messages are sent to the <Assistant /> component in App.svelte
  import { onMount } from "svelte"
  import { player } from "@modules/state/base/stores"
  import {
    sendMessage,
    clearMessage,
    tutorialProgress,
    currentMessage,
  } from "@modules/ui/assistant"

  $: {
    if ($tutorialProgress && $currentMessage?.explanation) {
      sendMessage($currentMessage.explanation)
    } else if ($tutorialProgress && !$currentMessage?.explanation) {
      clearMessage()
    }
  }

  onMount(() => {
    if ($currentMessage?.explanation) {
      sendMessage($currentMessage.explanation)
    }
  })
</script>

{#if import.meta.env.DEV}
  <div class="test">
    <button on:click={() => $tutorialProgress++}> Add </button>
    <button
      on:click={() => {
        $tutorialProgress = 0
        clearMessage()
      }}
    >
      Reset
    </button>

    {$player.tutorialLevel}
    {Number($tutorialProgress)}
  </div>
{/if}

<style>
  .test {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 999;
    background: red;
  }
</style>
