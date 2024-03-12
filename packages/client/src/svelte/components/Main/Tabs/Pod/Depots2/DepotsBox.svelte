<script lang="ts">
  import { simulatedDepots } from "@modules/state/simulated/stores"
  import Depot from "./Depot.svelte"
</script>

<div class="depots-box">
  {#if $simulatedDepots}
    {#each Object.entries($simulatedDepots) as [key, depot], index}
      <Depot {key} {depot} {index} />
    {/each}
  {/if}
</div>

<style lang="scss">
  .depots-box {
    // padding: 20px;
    width: 100%;
    height: 100%;
    z-index: 10;
    overflow-y: scroll;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 15px;
    padding-right: 15px;
  }
</style>
