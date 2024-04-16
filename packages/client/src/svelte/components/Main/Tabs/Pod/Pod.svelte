<script lang="ts">
  import { fade } from "svelte/transition"
  import Graph from "@components/Main/Tabs/Pod/Graph/Graph.svelte"
  import { tutorialProgress } from "@modules/ui/assistant"

  import DepotsBox from "@components/Main/Tabs/Pod/Depots/DepotsBox.svelte"
  import Tooltips from "@components/Main/Tabs/Pod/Tooltip/Tooltips.svelte"
</script>

<div class="pod">
  <div class="stats">
    {#if $tutorialProgress > 6}
      <DepotsBox />
    {/if}
  </div>
  <div class="graph" in:fade={{ duration: 100 }}>
    <Graph on:resize />
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
