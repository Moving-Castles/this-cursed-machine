<script lang="ts">
  import { fade } from "svelte/transition"
  import Graph from "@components/Main/Tabs/Pod/Graph/Graph.svelte"
  import Graph2 from "@components/Main/Tabs/Pod/Graph2/Graph.svelte"
  import Graph3 from "@components/Main/Tabs/Pod/Graph3/Graph.svelte"
  import Graph4 from "@components/Main/Tabs/Pod/Graph4/Graph.svelte"
  import Graph5 from "@components/Main/Tabs/Pod/Graph5/Graph.svelte"

  import DepotsBox from "@components/Main/Tabs/Pod/Depots2/DepotsBox.svelte"
  import OrderBar from "@components/Main/Tabs/Pod/OrderBar/OrderBar.svelte"

  import Tooltips from "@components/Main/Tabs/Pod/Tooltip/Tooltips.svelte"

  let activeGraph = 5
</script>

<div class="pod" in:fade>
  <div class="status-bar">
    <OrderBar />
  </div>
  <div class="stats">
    <DepotsBox />
  </div>
  <div class="graph">
    {#if activeGraph === 1}
      <Graph />
    {/if}
    {#if activeGraph === 2}
      <Graph2 />
    {/if}
    {#if activeGraph === 3}
      <Graph3 />
    {/if}
    {#if activeGraph === 4}
      <Graph4 />
    {/if}
    {#if activeGraph === 5}
      <Graph5 />
    {/if}

    <!-- <div class="graph-overlay" /> -->
  </div>
</div>

<div class="graph-switch">
  <button on:click={() => (activeGraph = 1)}>Graph 1</button>
  <!-- <button on:click={() => (activeGraph = 2)}>Graph 2</button>
  <button on:click={() => (activeGraph = 3)}>Graph 3</button>
  <button on:click={() => (activeGraph = 4)}>Graph 4</button> -->
  <button on:click={() => (activeGraph = 5)}>Graph 5</button>
</div>

<Tooltips />

<style lang="scss">
  .graph-switch {
    position: fixed;
    top: 10px;
    right: 10px;
    z-index: 10000;
    background: red;
  }
  .status-bar {
    height: 40px;
    border-bottom: 5px double var(--color-border);
    font-size: 14px;
  }

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

  .graph-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 255, 0, 1);
    // background-image: url(/images/noise2.png);
    background-image: url(/images/scanlines.png);
    background-size: 400px 400px;
    // filter: blur(1px);
    // backdrop-filter: blur(1px);
    // backdrop-filter: saturate(5);
    // mix-blend-mode: difference;
    mix-blend-mode: lighten;
    opacity: 0.3;
    z-index: 10;
    backdrop-filter: saturate(100%);
  }
</style>
