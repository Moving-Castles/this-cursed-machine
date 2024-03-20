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
    <!-- <div class="graph-overlay" /> -->
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

  .graph-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    // background-color: rgb(255, 0, 149);
    background-image: url(/images/scanlines.png);
    // background-image: url(/images/g2.png);
    // background-image: url(/images/vhs.webp);

    background-size: 400px 400px;
    // filter: blur(1px);
    // backdrop-filter: blur(1px);
    // backdrop-filter: saturate(5);
    mix-blend-mode: hard-light;
    // mix-blend-mode: difference;
    // mix-blend-mode: lighten;
    opacity: 0.1;
    z-index: 10;
    backdrop-filter: saturate(100%);
  }
</style>
