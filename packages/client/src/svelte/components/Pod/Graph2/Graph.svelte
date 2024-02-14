<script lang="ts">
  import {
    simulatedMachines,
    simulatedConnections,
  } from "../../../modules/state/simulated/stores"
  import type { Connection } from "../../../modules/state/simulated/types"
  import type { GraphMachines } from "./types"
  import Grid from "./Grid/Grid.svelte"
  import Machine from "./Machine/Machine.svelte"
  import { createLayout } from "./layout"

  // $: console.log("$simulatedMachines", $simulatedMachines)
  // $: console.log("$simulatedConnections", $simulatedConnections)

  let graphMachines: GraphMachines = {}
  let graphConnections: Connection[] = []

  // Calculate the new layout based on new and old state
  $: ({ graphMachines, graphConnections } = createLayout(
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
