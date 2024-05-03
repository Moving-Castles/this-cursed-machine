<script lang="ts">
  import { simulatedTanks } from "@modules/state/simulated/stores"
  import { tutorialProgress } from "@modules/ui/assistant"
  import Tank from "./Tank.svelte"
</script>

<div class="tanks-box" class:hidden={$tutorialProgress < 1}>
  {#if $simulatedTanks}
    {#each Object.entries($simulatedTanks) as [address, tank], index}
      <Tank {address} {tank} {index} />
    {/each}
  {/if}
</div>

<style lang="scss">
  .tanks-box {
    width: 100%;
    height: 100%;
    z-index: var(--z-1);
    overflow-y: scroll;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 15px;
    padding-right: 15px;
    pointer-events: none;

    &.highlight {
      animation: 1s ease-in-out infinite alternate highlight;
    }
  }

  @keyframes highlight {
    from {
      background: var(--color-success);
    }
    to {
      background: transparent;
    }
  }
</style>
