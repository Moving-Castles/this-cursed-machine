<script lang="ts">
  import { machineDefinitions } from "../../modules/state/definitions.ts"
  import TileActions from "./TileActions.svelte"
  import InventoryItem from "./InventoryItem.svelte"
  import { onDragOver } from "../../modules/ui/events"
  import { getContext } from "svelte"
  import { hoverDestination } from "../../modules/state"
  // import { showInventory } from "../../modules/ui/stores"
  export let untraversable = false

  let timeout: NodeJS.Timeout

  const tile = getContext("tile") as GridTile
  let active = false
  let inventory: BuildableMachine[] = []

  for (let i = 0; i < machineDefinitions.length; i++) {
    inventory = [...inventory, machineDefinitions[i]]
  }

  const onClick = () => {
    clearTimeout(timeout)
    active = true

    timeout = setTimeout(() => {
      active = false
    }, 3000)
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  on:dragenter|preventDefault
  on:dragover|preventDefault={() => onDragOver(tile.coordinates)}
  on:click={onClick}
  on:mouseenter={() => {
    hoverDestination.set(tile.coordinates)
  }}
  class:untraversable
  class="empty-tile"
>
  <div class="add">+</div>
</div>

{#if active}
  <TileActions on:close={() => (active = false)}>
    {#each inventory as buildableMachine (buildableMachine)}
      <InventoryItem {buildableMachine} />
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
