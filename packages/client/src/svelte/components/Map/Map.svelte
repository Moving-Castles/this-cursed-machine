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
    {#each $connections as connection, i (connection)}
      <Path
        startPoint={connection.start}
        endPoint={connection.end}
        connectionType={connection.type}
        pathIndex={i}
      />
    {/each}
    {#each $potentialConnections as potential, i (potential)}
      <Path
        startPoint={potential.start}
        endPoint={potential.end}
        connectionType={potential.type}
        potential
        pathIndex={i}
      />
    {/each}
    {#key $plannedConnection}
      <Path
        startPoint={$plannedConnection.start}
        endPoint={$plannedConnection.end}
        connectionType={$plannedConnection.type}
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
      width: 700px;
      height: 700px;
    }
  }
</style>
