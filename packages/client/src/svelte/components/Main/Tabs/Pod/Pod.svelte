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
    border-bottom: 5px double var(--color-border);
  }

  .graph {
    height: calc(100vh - 240px);
    position: relative;
    // animation: hue-rotate-animation 5s infinite linear;
  }

  @keyframes hue-rotate-animation {
    0% {
      filter: hue-rotate(0deg);
    }
    100% {
      filter: hue-rotate(360deg);
    }
  }
</style>
