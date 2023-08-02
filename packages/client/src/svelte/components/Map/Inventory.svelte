<script lang="ts">
  import { onMount } from "svelte"
  import {
    gameConfig,
    organs,
    buildableOrgans
  } from "../../modules/state"
  import { BuildableEntityType } from "../../modules/state/types"
  import InventoryItem from "./InventoryItem.svelte"
  import { showInventory } from "../../modules/ui/stores"
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

    return inventory
  }

  const close = ({ key }: string) => {
    if (key === "Escape") $showInventory = false
  }

  onMount(() => {
    console.log('mounting')
    inv = initInventory($gameConfig?.gameConfig.worldWidth)
  })
</script>

<svelte:window bind:innerWidth={w} bind:innerHeight={h} on:keydown={close} />

<div class="inventory">
  <div class="inventory-container" bind:clientWidth={containerWidth}>
    {#each inv as tile (tile.id)}
      <InventoryTile {tile} />
    {/each}
  </div>
</div>

<style lang="scss">
  .inventory {
    width: 100%;
    overflow: auto;
    padding: 0;
    bottom: 0;
    position: fixed;

    .inventory-container {
      height: var(--tilesize);
      margin: var(--row-gap) var(--col-gap) ;
      gap: var(--col-gap);
      display: flex;
      position: relative;
      justify-content: center;
    }
  }
</style>
