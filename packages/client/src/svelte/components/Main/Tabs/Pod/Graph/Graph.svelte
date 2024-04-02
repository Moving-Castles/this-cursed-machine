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

  let graphMachines: GraphMachines = {}
  let graphConnections: GraphConnection[] = []
  let grid: Grid

  // Calculate the new layout based on new and old state
  $: ({ graphMachines, graphConnections, grid } = createLayout(
    $playerPod.fixedEntities,
    $simulatedMachines,
    $simulatedConnections,
    graphMachines,
  ))
</script>

<div class="graph-container">
  <div class="grid">
    <div class="top">
      {#each Object.values(graphMachines) as machine}
        <MachineSelector {machine} />
      {/each}
      <svg {width} {height}>
        {#each graphConnections as connection}
          <Connection {connection} />
        {/each}
      </svg>
    </div>
    <GridComponent {grid} />
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
