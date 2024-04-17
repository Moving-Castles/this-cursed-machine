<script lang="ts">
  import { onMount, tick, createEventDispatcher } from "svelte"
  import { playerPod } from "@modules/state/base/stores"
  import { GRID, CELL } from "./constants"
  import { graphScale, graphElement, thud } from "@modules/ui/stores"
  import {
    simulatedMachines,
    simulatedConnections,
  } from "@modules/state/simulated/stores"
  import { networkIsRunning } from "@modules/state/simulated/stores"

  import { createLayout } from "./layout"

  import GridComponent from "./Grid/Grid.svelte"
  import MachineSelector from "./Machines/MachineSelector.svelte"
  import Connection from "./Connections/Connection.svelte"
  import { playSound } from "@svelte/modules/sound"

  const dispatch = createEventDispatcher()

  let [parent, child]: [HTMLElement | null, HTMLElement | null] = [null, null]

  const width = GRID.WIDTH * CELL.WIDTH
  const height = GRID.HEIGHT * CELL.HEIGHT

  let scale = 1

  const calcScale = async () => {
    graphScale.set(1)

    // Wait for scale to update so we can start calculating with initial values
    await tick()

    const p = parent?.getBoundingClientRect()
    const c = child?.getBoundingClientRect()

    if (!p || !c) return

    const PADDING = 50

    const growWidth = p.width - PADDING * 2
    const growHeight = p.height - PADDING * 2
    const widthBy = growWidth - c.width
    const heightBy = growHeight - c.height

    // Get widthBy as a scale
    const scaleX = widthBy / c.width
    const scaleY = heightBy / c.height

    graphScale.set(Math.max(1, 1 + Math.min(scaleX, scaleY)))

    dispatch("resize")
  }

  let layout = {
    graphMachines: {},
    graphConnections: [],
    grid: {},
  }

  // Calculate the new layout based on new and old state
  $: layout = createLayout(
    $playerPod?.fixedEntities,
    $simulatedMachines,
    $simulatedConnections,
    layout.graphMachines,
  )

  // Play sound when network is running
  let networkRunningSound: Howl | undefined
  $: if ($networkIsRunning) {
    networkRunningSound = playSound("tcm", "machineFlowing", true)
  } else {
    if (networkRunningSound) {
      networkRunningSound.stop()
    }
  }

  onMount(calcScale)
</script>

<svelte:window on:resize={calcScale} />

<div class:thud={$thud} class="graph-container" bind:this={parent}>
  <div style:transform="scale({$graphScale})" class="grid" bind:this={child}>
    <div class="top">
      {#each Object.entries(layout.graphMachines) as [address, machine], i (address)}
        <MachineSelector {i} {address} {machine} />
      {/each}
      <svg
        bind:this={$graphElement}
        id="graph"
        {width}
        {height}
        xmlns="http://www.w3.org/2000/svg"
      >
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
    overflow: hidden;

    --cellHeight: 9px;
    --cellWidth: 9px;

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
