<script lang="ts">
  import { NULL_COORDINATE, dropDestination, BUILDABLE_ENTITYTYPES } from "../../modules/state"
  import TileActions from "./TileActions.svelte"
  import { build } from "../../modules/action"
  import { BuildableEntityType, EntityType } from "../../modules/state/types"
  import { getContext} from "svelte"  
  // import { showInventory } from "../../modules/ui/stores"
  export let untraversable = false

  let timeout: NodeJS.Timeout
  
  const tile = getContext("tile") as GridTile
  let active = false

  // const numOrganTypes = Object.keys(BuildableEntityType).length / 2;
  let inventory: EntityType[] = []

  for (let i = 0; i < BUILDABLE_ENTITYTYPES.length; i++) {
    inventory = [...inventory, BUILDABLE_ENTITYTYPES[i]]
  }

  const onDrop = (e) => {
    console.log(e.dataTransfer.getData("text"))
    dropDestination.set(NULL_COORDINATE)
    onClick()
  }

  const onClick = () => {
    clearTimeout(timeout)
    active = true

    timeout = setTimeout(() => { active = false }, 3000)
  }

  const mappings: Record<EntityType, string> = {
    [EntityType.RESOURCE]: "RES",
    [EntityType.RESOURCE_TO_ENERGY]: "R2E",
  };
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  on:dragenter|preventDefault
  on:dragover|preventDefault
  on:drop|preventDefault={onDrop}
  on:click={onClick}
  class:untraversable
  class="empty-tile">
</div>

{#if active}
  <TileActions on:close={() => active = false}>
    {#each inventory as entityType (entityType)}
      <button class="action organ" on:click={() => build(entityType, tile.coordinates.x, tile.coordinates.y)}>
        {tile.coordinates.x} {tile.coordinates.y}
        {mappings[entityType]}
      </button>
    {/each}
  </TileActions>
{/if}

<style lang="scss">
  .empty-tile {
    width: 100%;
    height: 100%;

    &:hover::after {
      position: absolute;
      content: "+";
      font-size: 5rem;
      text-align: center;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      opacity: 0.8;
      z-index: 0;
    }
  }

  .untraversable {
    // opacity: 0;
  }

  .organ {
    background: yellow;
    color: black;
    width: 40px;
    height: 40px;
    border-radius: 100%;
  }
</style>
