<script lang="ts">
  import { onMount } from "svelte"
  import { playSound } from "../../modules/sound"
  import { steppedFlyTop, steppedFlyBottom } from "../../modules/ui/transitions"
  import { transfer, complete } from "../../modules/action"
  import { showLevelModal, lastCompletedBlock } from "../../modules/ui/stores"
  import { waitForCompletion } from "../../modules/action/actionSequencer/utils"
  import CompletedLevel from "./CompletedLevel.svelte"
  import { blockNumber } from "../../modules/network"
  import { playerEntity } from "../../modules/state"

  let loading = false
  let loadingMessage = ""

  const handleTransfer = async () => {
    if ($playerEntity.level === 7) {
      loadingMessage = "Completing worker evaluation"
      loading = true
      await waitForCompletion(complete())
    } else {
      loadingMessage = "Receiving new order"
      loading = true
      await waitForCompletion(transfer())
    }
    // Close modal
    showLevelModal.set(false)
    // Used to avoid double completion bug
    lastCompletedBlock.set($blockNumber)
  }

  onMount(() => {
    playSound("tcm", "playerLvlend")
  })
</script>

<div class="level-modal-container">
  <div in:steppedFlyTop out:steppedFlyBottom class="level-modal">
    {#if loading}
      <div class="loading-message">
        <div class="loading">{loadingMessage}</div>
      </div>
    {:else}
      <CompletedLevel on:transfer={handleTransfer} />
    {/if}
  </div>
</div>

<style lang="scss">
  .level-modal-container {
    position: fixed;
    z-index: 50000;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
  }

  .level-modal {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 80vw;
    height: 80vh;
    padding: 2rem;
    background: var(--terminal-background);
    border: var(--terminal-border);
    // font-size: 32px;
    z-index: 999999;

    .loading-message {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .loading {
      animation: pulseOpacity 1s infinite;
    }
  }

  @keyframes pulseOpacity {
    0% {
      opacity: 0.3;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0.3;
    }
  }
</style>
