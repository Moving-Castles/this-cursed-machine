<script lang="ts">
  import { simulatedTanks } from "@modules/state/simulated/stores"
  import { tutorialProgress } from "@modules/ui/assistant"
  import Tank from "./Tank.svelte"

  function sortObjectByBuildIndex<T extends { buildIndex: number }>(obj: {
    [key: string]: T
  }): { [key: string]: T } {
    const entries = Object.entries(obj)

    const sortedEntries = entries.sort(
      ([, a], [, b]) => a.buildIndex - b.buildIndex,
    )

    return Object.fromEntries(sortedEntries)
  }
</script>

<div class="tanks-box" class:hidden={$tutorialProgress < 1}>
  {#if $simulatedTanks}
    {#each Object.entries(sortObjectByBuildIndex($simulatedTanks)) as [address, tank]}
      <Tank {address} {tank} />
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
