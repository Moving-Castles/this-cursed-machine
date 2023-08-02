<script lang="ts">
  import { onMount } from "svelte"
  import {
    gameConfig,
    connections,
    potentialConnections,
    plannedConnection,
  } from "../../modules/state"
  import { explainer } from "../../modules/content/wiki"
  import type { GridTile } from "./index"
  import Tile from "./Tile.svelte"
  import Path from "./Path.svelte"
  import Explainer from "../Explainer/Explainer.svelte"

  let w: number
  let h: number
  let containerWidth: number
  let grid: GridTile[] = []

  /**
   * Function to initialize a square grid of GridTiles with the side length specified by `unit`.
   * Each GridTile is an object with a unique `id` and `coordinates` based on its position in the grid.
   *
   * @param {number} unit - The side length of the square grid.
   * @return {GridTile[]} grid - The resulting array of GridTiles, each representing a cell in the grid.
   */
  function initGrid(unit: number) {
    // Create an empty array to hold the grid
    let grid = [] as GridTile[]

    // Loop through each row of the grid (represented by y)
    for (let y = 0; y < unit; y++) {
      // Within each row, loop through each cell (represented by x)
      for (let x = 0; x < unit; x++) {
        // Create a new GridTile object with a unique id and coordinates corresponding to its position
        const newGridTile: GridTile = {
          id: `${x}-${y}`,
          coordinates: { x: x, y: y },
        }

        // Add the new GridTile to the end of the grid array
        grid = [...grid, newGridTile]
      }
    }

    // Return the fully constructed grid
    return grid
  }

  $: console.log("cons", $plannedConnection)

  onMount(() => {
    grid = initGrid($gameConfig?.gameConfig.worldWidth)
  })
</script>

<svelte:window bind:innerWidth={w} bind:innerHeight={h} />

<div class="ui-map">
  <div class="map-container" bind:clientWidth={containerWidth}>
    {#each grid as tile (tile.id)}
      <Tile {tile} />
    {/each}
    {#each Object.values($connections) as connection, i (connection)}
      <Path
        {connection}
        pathIndex={i}
      />
    {/each}
    <!-- {#each $potentialConnections as { start, end }, i (i)}
      <Path
        potential
        startCoord={start}
        endCoord={end}
        pathIndex={i}
      />
    {/each}
    -->
    {#key $plannedConnection}
      <Path
        startCoord={$plannedConnection.start}
        endCoord={$plannedConnection.end}
        planned
      />
    {/key}

    {#if $explainer !== ""}
      <Explainer />
    {/if}
  </div>
</div>

<style lang="scss">
  .ui-map {
    height: 100%;
    width: 100%;
    overflow: auto;
    padding: 0;

    .map-container {
      margin: 400px;
      box-sizing: border-box;
      position: relative;
      width: 400px;
      height: 400px;
    }
  }
</style>
