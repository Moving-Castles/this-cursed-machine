<script lang="ts">
  import { onMount } from "svelte"
  import { explainer } from "../../modules/content/wiki"
  import { connections, paths, makePlannedPath } from "../../modules/state"
  import type { GridTile } from "./index"
  import Tile from "./Tile.svelte"
  import Explainer from "../Explainer/Explainer.svelte"
  // import Connection from "./Connection.svelte"
  import BoxPath from "./BoxPath.svelte"

  export let width: number
  export let height: number

  const plannedPath = makePlannedPath(width, height)

  let w: number
  let h: number
  let grid: GridTile[] = []

  function initGrid(width: number, height: number) {
    // Create an empty array to hold the grid
    let grid = [] as GridTile[]

    // Loop through each row of the grid (represented by y)
    for (let y = 0; y < height; y++) {
      // Within each row, loop through each cell (represented by x)
      for (let x = 0; x < width; x++) {
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
    grid = initGrid(width, height)
  })
</script>

<svelte:window bind:innerWidth={w} bind:innerHeight={h} />

<div class="ui-map">
  <div
    class="map-container"
    style:width="{width * 100}px"
    style:height="{height * 100}px"
  >
    {#each grid as tile (tile.id)}
      <Tile {tile} />
    {/each}
    <!-- Paths will go here -->
    {#each Object.entries($paths) as [_, path], i (path)}
      <BoxPath coords={path} />
    {/each}

    {#key $plannedPath}
      <BoxPath coords={$plannedPath} />
    {/key}

    <!-- Explainers will go here -->
    {#if $explainer !== ""}
      <Explainer />
    {/if}
  </div>
</div>

<div class="ui-connections debug">
  {#each Object.entries($connections) as [_, connection], i (connection)}
    <!-- {address}: {connection} -->
    <!-- <Connection {connection} /> -->
  {/each}
</div>

<style lang="scss">
  .ui-connections {
    position: fixed;
    bottom: 0;
    background: black;
    z-index: 999;
    color: white;
  }
  .ui-map {
    height: 100dvh;
    width: 100dvw;
    overflow: auto;
    padding: 0;
    position: relative;

    .map-container {
      box-sizing: border-box;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
</style>
