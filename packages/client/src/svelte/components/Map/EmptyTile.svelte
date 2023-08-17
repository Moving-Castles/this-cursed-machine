<script lang="ts">
  import { NULL_COORDINATE, dropDestination, BUILDABLE_ENTITYTYPES, buildableOrgans } from "../../modules/state"
  import TileActions from "./TileActions.svelte"
  import InventoryItem from "./InventoryItem.svelte"
  import { onDragOver } from "../../modules/ui/events"
  import { EntityType } from "../../modules/state/enums"
  import { getContext } from "svelte"  
  // import { showInventory } from "../../modules/ui/stores"
  export let untraversable = false

  let timeout: NodeJS.Timeout
  
  const tile = getContext("tile") as GridTile
  let active = false
  // const canAffordOrgan = playerCanAffordOrgan()

  // const numOrganTypes = Object.keys(BuildableEntityType).length / 2;
  let inventory: BuildableEntity[] = []

  for (let i = 0; i < buildableOrgans.length; i++) {
    inventory = [...inventory, buildableOrgans[i]]
  }

  // const onDrop = (e) => {
  //   console.log(e.dataTransfer.getData("text"))
  //   dropDestination.set(NULL_COORDINATE)
  //   onClick()
  // }

  const onClick = () => {
    clearTimeout(timeout)
    active = true

    timeout = setTimeout(() => { active = false }, 3000)
  }

  // const mappings: Record<EntityType, string> = {
  //   [EntityType.RESOURCE]: "RES",
  //   [EntityType.RESOURCE_TO_ENERGY]: "R2E",
  // };
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  on:dragenter|preventDefault
  on:dragover|preventDefault={() => onDragOver(tile.coordinates)}
  on:click={onClick}
  class:untraversable
  class="empty-tile">

  <div class="add">
    +
  </div>
</div>

{#if active}
  <TileActions on:close={() => active = false}>
    {#each inventory as buildableEntity (buildableEntity)}
<!--       <button class="action organ" 
        disabled={!playerCanAffordOrgan(entityType.cost) }
        on:click={() => build(entityType.type, tile.coordinates.x, tile.coordinates.y)}>
        {tile.coordinates.x} {tile.coordinates.y}
        {entityType.type}
      </button> -->
      <InventoryItem buildableEntity={buildableEntity} tile={tile} />

    {/each}
  </TileActions>
{/if}

<style lang="scss">
  .empty-tile {
    width: 100%;
    height: 100%;

    .add {
      position: absolute;
      content: "+";
      font-size: 5rem;
      text-align: center;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      opacity: 0.8;
      z-index: 999;
      opacity: 0;
    }

    &:hover .add {
      opacity: 1;
    }
  }

  .untraversable {
    // opacity: 0;
  }
</style>
