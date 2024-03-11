<script lang="ts">
  import {
    simulatedMachines,
    simulatedConnections,
  } from "@modules/state/simulated/stores"
  import { createLayout } from "../Graph4/layout"

  import type { GraphConnection, GraphMachines } from "./types"

  import Machine from "./Machines2/Machine.svelte"

  // ........

  let svg: any

  let graphMachines: GraphMachines = {}
  let graphConnections: GraphConnection[] = []

  $: ({ graphMachines, graphConnections } = createLayout(
    $simulatedMachines,
    $simulatedConnections,
  ))

  let width = 0
  let height = 0

  $: console.log("graphMachines", graphMachines)
  $: console.log("graphConnections", graphConnections)
</script>

<div class="wrapper" bind:clientWidth={width} bind:clientHeight={height}>
  <svg
    bind:this={svg}
    style:width="{width}px"
    style:height="{height}px"
    viewBox={String([-width / 2, -height / 2, width, height])}
  >
    <!-- MACHINES -->
    {#each Object.values(graphMachines) as machine}
      <Machine {machine} />
    {/each}
  </svg>
</div>

<style>
  .wrapper {
    position: relative;
    width: 100%;
    height: 100%;
  }
  svg {
    width: 100%;
    height: 100%;
    max-width: 100%;
    float: left;
  }

  .machine-text {
    pointer-events: none;
  }

  svg :global(.node),
  svg :global(.node-image),
  svg :global(.rect),
  svg :global(.node-rect) {
    transform-origin: center; /* or transform-origin: 50% */
    transform-box: fill-box;
  }

  .node {
    transition: filter 1s ease;
    filter: grayscale(1) brightness(0.2) contrast(0.5);
  }

  .node.CONNECTED {
    filter: grayscale(0) brightness(1) contrast(1);
  }

  .node.FLOWING {
    filter: grayscale(0) brightness(1) contrast(1);
  }

  .MACHINE_NONE {
    background-image: url("/images/machines/NONE.png");
  }

  .MACHINE_INLET {
    background-image: url("/images/machines/INLET.png");
  }

  .MACHINE_OUTLET {
    background-image: url("/images/machines/OUTLET.png");
  }

  .MACHINE_PLAYER {
    background-image: url("/images/machines/CORE4.png");
  }

  .MACHINE_SPLITTER {
    background-image: url("/images/machines/SPLITTER.png");
  }

  .MACHINE_MIXER {
    background-image: url("/images/machines/MIXER.png");
  }

  .MACHINE_DRYER {
    background-image: url("/images/machines/DRYER.png");
  }

  .MACHINE_WETTER {
    background-image: url("/images/machines/WETTER.png");
  }

  .MACHINE_BOILER {
    background-image: url("/images/machines/BOILER.png");
  }

  .MACHINE_COOLER {
    background-image: url("/images/machines/COOLER.png");
  }
</style>
