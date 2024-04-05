<script lang="ts">
  import { playerPod } from "@modules/state/base/stores"
  import { GRID, CELL } from "./constants"

  import {
    simulatedMachines,
    simulatedConnections,
  } from "@modules/state/simulated/stores"
  import type { GraphMachines, GraphConnection } from "./types"

  import { createLayout } from "./layout"

  import GridComponent from "./Grid/Grid.svelte"
  import MachineSelector from "./Machines/MachineSelector.svelte"
  import Connection from "./Connections/Connection.svelte"
  import type { Grid } from "./Pathfinding/types"

  const width = GRID.WIDTH * CELL.WIDTH
  const height = GRID.HEIGHT * CELL.HEIGHT

  let layout = {
    graphMachines: {},
    graphConnections: [],
    grid: {},
  }

  // Calculate the new layout based on new and old state
  $: layout = createLayout(
    $playerPod.fixedEntities,
    $simulatedMachines,
    $simulatedConnections,
    layout.graphMachines
  )
</script>

<div class="graph-container">
  <div class="grid">
    <div class="top">
      {#each Object.entries(layout.graphMachines) as [address, machine], i (address)}
        <MachineSelector {i} {address} {machine} />
      {/each}
      <svg id="graph" {width} {height}>
        {#each layout.graphConnections as connection (connection.id)}
          <Connection {connection} />
        {/each}
      </svg>
    </div>
    <GridComponent grid={layout.grid} />
  </div>
</div>

<style lang="scss">
  .graph-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    cursor: crosshair;
    // transform: scale(1.1);

    --cellHeight: 10px;
    --cellWidth: 10px;

    .grid {
      position: relative;

      .top {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
    }
  }
</style>
