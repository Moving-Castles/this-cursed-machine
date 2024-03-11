<script lang="ts">
  import { playerPod } from "@modules/state/base/stores"
  import {
    simulatedMachines,
    simulatedConnections,
  } from "@modules/state/simulated/stores"
  import type { GraphMachines, GraphConnection } from "./types"
  import { createLayout } from "./layout"

  import Grid from "./Grid/Grid.svelte"
  import Machine from "./Machine/Machine.svelte"
  import Connection from "./Connection/Connection.svelte"

  let graphMachines: GraphMachines = {}
  let graphConnections: GraphConnection[] = []

  // Calculate the new layout based on new and old state
  $: ({ graphMachines, graphConnections } = createLayout(
    $playerPod.fixedEntities,
    $simulatedMachines,
    $simulatedConnections,
    graphMachines,
    graphConnections,
  ))
</script>

<div class="graph">
  <div class="grid">
    <div class="top">
      {#each Object.values(graphMachines) as machine}
        <Machine {machine} />
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
    background: orangered;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;

    --cellHeight: 55px;
    --cellWidth: 55px;

    .grid {
      position: relative;

      .top {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 0, 0, 0.5);
      }
    }
  }
</style>
