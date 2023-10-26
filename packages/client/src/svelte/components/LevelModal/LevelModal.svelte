<script lang="ts">
  import { onMount } from "svelte"
  import { playSound } from "../../modules/sound"
  import { transfer } from "../../modules/action"
  import { showLevelModal } from "../../modules/ui/stores"
  import {
    waitForCompletion,
    waitForTransaction,
  } from "../Terminal/functions/helpers"
  import CompletedLevel from "./CompletedLevel.svelte"

  let loading = false

  const handleTransfer = async () => {
    loading = true
    // Initiate transfer
    const action = transfer()
    console.log(action)
    // @todo Show loading state in box here
    await waitForTransaction(action)
    await waitForCompletion(action)
    // Close modal
    showLevelModal.set(false)
  }

  onMount(() => {
    playSound("tcm", "alarm")
  })
</script>

<div class="level-modal">
  {#if loading}
    <div class="loading">Receiving new instructions</div>
  {:else}
    <CompletedLevel on:transfer={handleTransfer} />
  {/if}
</div>

<style lang="scss">
  .level-modal {
    position: fixed;
    z-index: 50000;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 80vw;
    height: 80vh;
    padding: 2rem;
    background: var(--terminal-background);
    border: var(--terminal-border);
    font-size: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
