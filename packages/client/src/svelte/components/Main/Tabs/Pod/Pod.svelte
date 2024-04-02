<script lang="ts">
  import { fade } from "svelte/transition"
  import Graph from "@components/Main/Tabs/Pod/Graph/Graph.svelte"

  import DepotsBox from "@components/Main/Tabs/Pod/Depots2/DepotsBox.svelte"
  import Tooltips from "@components/Main/Tabs/Pod/Tooltip/Tooltips.svelte"
</script>

<div class="pod" in:fade>
  <div class="stats">
    <DepotsBox />
  </div>
  <div class="graph">
    <Graph />
  </div>
</div>
<Tooltips />

<style lang="scss">
  .stats {
    height: 100px;
    border-bottom: var(--default-border-style);
  }

  .graph {
    height: calc(100vh - 240px);
    position: relative;
  }
</style>
