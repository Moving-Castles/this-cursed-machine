<script lang="ts">
  import { depots } from "../../modules/state"
  import Depot from "./Depot.svelte"
</script>

<div class="depots-box">
  {#each Object.entries($depots) as [_, depot], index}
    <Depot {depot} {index} />
  {/each}
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
