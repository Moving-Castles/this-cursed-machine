<script lang="ts">
  import { depots } from "../../../modules/state/base/stores"
  import { simulatedDepots } from "../../../modules/state/simulated/stores"
  import { patches } from "../../../modules/state/resolver/patches/stores"
  import Depot from "./Depot.svelte"

  // $: console.log("$depots", $depots)
  // $: console.log("$simulatedDepots", $simulatedDepots)
  // $: console.log("$patches", $patches)
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
