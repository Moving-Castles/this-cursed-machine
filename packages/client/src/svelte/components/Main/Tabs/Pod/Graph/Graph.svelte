<script lang="ts">
  import { playerPod } from "@modules/state/base/stores"
  import {
    simulatedMachines,
    simulatedConnections,
  } from "@modules/state/simulated/stores"
  import type { GraphMachines, GraphConnection } from "./types"

  import { createLayout } from "./layout"

  import Grid from "./Grid/Grid.svelte"
  import MachineSelector from "./Machines/MachineSelector.svelte"
  import Connection from "./Connections/Connection.svelte"

  let graphMachines: GraphMachines = {}
  let graphConnections: GraphConnection[] = []

  // Calculate the new layout based on new and old state
  $: ({ graphMachines, graphConnections } = createLayout(
    $playerPod.fixedEntities,
    $simulatedMachines,
    $simulatedConnections,
    graphMachines,
  ))
</script>

<div class="graph">
  <div class="grid">
    <!-- <div class="graph-overlay" /> -->
    <div class="top">
      {#each Object.values(graphMachines) as machine}
        <MachineSelector {machine} />
      {/each}
      {#each graphConnections as connection}
        <Connection {connection} />
      {/each}
    </div>
    <Grid />
  </div>
</div>

<style lang="scss">
  .graph {
    // background: orangered;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;

    --cellHeight: 10px;
    --cellWidth: 10px;

    .grid {
      position: relative;

      .graph-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        // background-color: rgb(128, 255, 0);
        // background-image: url(/images/noise2.png);
        // background-image: url(/images/g2.png);
        background-image: url(/images/scanlines.gif);

        // background-size: 400px 400px;
        background-size: cover;
        // filter: blur(1px);
        // backdrop-filter: blur(1px);
        // backdrop-filter: saturate(5);
        // mix-blend-mode: multiply;
        mix-blend-mode: difference;
        // mix-blend-mode: lighten;
        // mix-blend-mode: hard-light;
        opacity: 0.2;
        z-index: 10;
        // backdrop-filter: saturate(100%);
      }

      .top {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        // background: rgb(255, 181, 181);
      }
    }
  }
</style>
