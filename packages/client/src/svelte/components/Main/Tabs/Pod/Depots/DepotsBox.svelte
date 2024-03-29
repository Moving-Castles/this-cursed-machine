<script lang="ts">
  import { simulatedDepots } from "@modules/state/simulated/stores"
  import { tutorialProgress } from "@modules/ui/assistant"
  import Depot from "./Depot.svelte"
</script>

<div class="depots-box" class:pulse-opacity={$tutorialProgress === 21}>
  {#if $simulatedDepots}
    {#each Object.entries($simulatedDepots) as [key, depot], index}
      <Depot {key} {depot} {index} />
    {/each}
  {/if}
</div>

<style lang="scss">
  .depots-box {
    padding: 20px;
    width: 100%;
    height: 100%;
    z-index: 10;
    max-height: calc(100vh - 40px);
    overflow-y: scroll;
    display: flex;
    align-items: center;
  }
</style>
