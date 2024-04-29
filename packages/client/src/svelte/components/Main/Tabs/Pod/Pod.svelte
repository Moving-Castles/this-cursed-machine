<script lang="ts">
  import { fade } from "svelte/transition"
  import Graph from "@components/Main/Tabs/Pod/Graph/Graph.svelte"
  import Discoveries from "@components/Main/Tabs/Pod/Discovery/Discoveries.svelte"
  import { tutorialProgress } from "@modules/ui/assistant"

  import TanksBox from "@components/Main/Tabs/Pod/Tanks/TanksBox.svelte"
  import Tooltips from "@components/Main/Tabs/Pod/Tooltip/Tooltips.svelte"
</script>

<div class="pod">
  <div class="stats">
    {#if $tutorialProgress > 6}
      <TanksBox />
    {/if}
  </div>
  <div class="graph" in:fade={{ duration: 100 }}>
    <Graph on:resize />
  </div>

  <Discoveries />
</div>

<!-- <Tooltips /> -->

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
