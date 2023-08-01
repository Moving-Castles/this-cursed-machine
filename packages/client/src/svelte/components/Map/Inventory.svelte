<script lang="ts">
  import { onMount } from "svelte"
  import {
    gameConfig,
    organs,
    buildableOrgans
  } from "../../modules/state"
  import { BuildableEntityType } from "../../modules/state/types"
  import InvTile from "./InvTile.svelte"
  import Path from "./Path.svelte"

  let w: number
  let h: number
  let containerWidth: number
  let inv: GridTile[] = []

  /**
   * Function to initialize a square grid of GridTiles with the side length specified by `unit`.
   * Each GridTile is an object with a unique `id` and `coordinates` based on its position in the grid.
   *
   * @param {number} unit - The side length of the square grid.
   * @return {GridTile[]} grid - The resulting array of GridTiles, each representing a cell in the grid.
   */
  function initInventory(unit: number) {
    // Create an empty array to hold the grid
    let inventory = [] as GridTile[]

    console.log('static content', BuildableEntityType)

    //this is inelegant
    const numOrganTypes = Object.keys(BuildableEntityType).length / 2;

    // Loop through each row of the grid (represented by y)
    for (let i = 0; i < numOrganTypes; i++) {
        const newOrgan: GridTile = {
          id: `${BuildableEntityType[i]}`,
          type: `${BuildableEntityType[i]}`,
          coordinates: { x: i, y: 0 },
        }
        console.log('adding tile to inv', newOrgan)
        // Add the new GridTile to the end of the grid array
        inventory = [...inventory, newOrgan]
    }

    // Return the fully constructed grid
    return inventory
  }

  onMount(() => {
    console.log('mounting')
    inv = initInventory($gameConfig?.gameConfig.worldWidth)
  })
</script>

<svelte:window bind:innerWidth={w} bind:innerHeight={h} />

<div class="inventory">
  <div class="inv-container" bind:clientWidth={containerWidth}>
    {#each inv as tile (tile.id)}
      <InvTile {tile} />
    {/each}
  </div>
</div>

<style lang="scss">
  .inventory {
    height: 20%;
    width: 100%;
    overflow: auto;
    padding: 0;
    position: fixed;
    bottom: 0px;
    background-color: pink;

    .inv-container {
      margin: 20px;
      position: relative;
    }
  }
</style>
