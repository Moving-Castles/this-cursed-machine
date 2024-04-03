<script lang="ts">
  import { fade } from "svelte/transition"
  import Graph from "@components/Main/Tabs/Pod/Graph/Graph.svelte"

  import { networkIsRunning } from "@modules/state/simulated/stores"

  import DepotsBox from "@components/Main/Tabs/Pod/Depots/DepotsBox.svelte"
  import Tooltips from "@components/Main/Tabs/Pod/Tooltip/Tooltips.svelte"
</script>

<div class="pod" in:fade>
  <div class="running">
    {$networkIsRunning}
  </div>

  <div class="stats">
    <DepotsBox />
  </div>
  <div class="graph">
    <Graph />
  </div>
</div>
<Tooltips />

<style lang="scss">
  .running {
    position: fixed;
    top: 10px;
    right: 10px;
    padding: 20px;
    background: red;
  }

  .stats {
    height: 100px;
    border-bottom: var(--default-border-style);
  }

  .graph {
    height: calc(100vh - 240px);
    position: relative;
  }
</style>
