<script lang="ts">
  import { playerPod } from "@modules/state/base/stores"
  import {
    simulatedMachines,
    simulatedConnections,
  } from "@modules/state/simulated/stores"
  import type { GraphMachines, GraphConnection } from "./types"
  import { createLayout } from "./layout"
  import Machine from "./Machine/Machine.svelte"
  import Connection from "./Connection/Connection.svelte"
  import type { SimulatedMachines } from "@modules/state/simulated/types"

  let graphMachines: GraphMachines = {}
  let graphConnections: GraphConnection[] = []

  // Calculate the new layout based on new and old state
  // $: ({ graphMachines, graphConnections } = createLayout(
  //   $playerPod.fixedEntities,
  //   $simulatedMachines,
  //   $simulatedConnections,
  //   graphMachines,
  //   graphConnections,
  // ))

  const updateLayout = async (
    machines: SimulatedMachines,
    connections: any[],
  ) => {
    ;({ graphMachines, graphConnections } = await createLayout(
      machines,
      connections,
    ))
  }

  $: updateLayout($simulatedMachines, $simulatedConnections)

  $: console.log("graphMachines", graphMachines)
  $: console.log("graphConnections", graphConnections)

  $: console.log("$playerPod.fixedEntities", $playerPod.fixedEntities)
</script>

<div class="graph">
  {#each $playerPod.fixedEntities.inlets as inlet, index}
    <div
      class="orfice inlet"
      style="top: {20 + 60 * index}px; left: 60px;"
    ></div>
  {/each}

  <div class="orfice outlet" style="bottom: 20px; right: 60px;"></div>

  <div class="top">
    {#each Object.values(graphMachines) as machine}
      <Machine {machine} />
    {/each}
    {#each graphConnections as connection}
      <Connection {connection} />
    {/each}
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

    --cellHeight: 55px;
    --cellWidth: 55px;

    .top {
      // background: rgba(255, 0, 0, 0.5);
      width: 400px;
      height: 400px;
      background: blue;
      position: relative;

      .body {
        position: absolute;
        display: none;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0.1;
        mix-blend-mode: multiply;
      }
    }
  }

  .orfice {
    position: absolute;
    width: 50px;
    height: 50px;
    background: black;
  }
</style>
