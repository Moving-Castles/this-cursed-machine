<script lang="ts">
  import { setContext } from "svelte"
  import { hoverDestination, tileEntity } from "../../modules/state"
  import { EntityType, MachineType } from "../../modules/state/types"
  // import Connectable from "./Connectable.svelte"
  import Core from "./Core.svelte"
  import EmptyTile from "./EmptyTile.svelte"
  import Machine from "./Machines/Machine.svelte"
  import Blocker from "./Machines/Blocker.svelte"
  import Inlet from "./Machines/Inlet.svelte"
  import Outlet from "./Machines/Outlet.svelte"
  import Blender from "./Machines/Blender.svelte"
  import Splitter from "./Machines/Splitter.svelte"
  import Scorcher from "./Machines/Scorcher.svelte"

  export let tile: GridTile

  setContext("tile", tile)

  const mappings = {
    0: Blocker,
    1: Inlet,
    2: Outlet,
    3: Blender,
    4: Splitter,
    5: Scorcher,
  }

  const entity = tileEntity(tile.coordinates)

  $: untraversable = EntityType[$entity?.entity?.type] === "UNTRAVERSABLE"
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="tile" class:untraversable>
  <div class="coords">{tile.coordinates.x}, {tile.coordinates.y}</div>

  {#if $entity}
    {#if EntityType[$entity.entity.entityType] === "CORE"}
      <Core entity={$entity} />
    {:else if EntityType[$entity.entity.entityType] === "MACHINE"}
      <Machine background={"yellow"} entity={$entity}>
        <svelte:fragment slot="content">
          {MachineType[$entity.entity.machineType]}
        </svelte:fragment>

        <!-- Organ actions -->
        <svelte:component
          this={mappings[$entity.entity.machineType]}
          slot="modal"
          entity={$entity}
        />
      </Machine>
    {:else if EntityType[$entity.entity.entityType] === "UNTRAVERSABLE"}
      <EmptyTile untraversable />
    {/if}
  {:else}
    <EmptyTile />
  {/if}
</div>

<style lang="scss">
  .tile {
    width: 100px;
    height: 100px;
    float: left;
    font-size: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-size: contain;
    background: lightgray;
    // background-image: url('data:image/svg+xml,%3csvg width=\'100%25\' height=\'100%25\' xmlns=\'http://www.w3.org/2000/svg\'%3e%3crect width=\'100%25\' height=\'100%25\' fill=\'none\' stroke=\'%23333\' stroke-width=\'4\' stroke-dasharray=\'20%2c 7\' stroke-dashoffset=\'6\' stroke-linecap=\'square\'/%3e%3c/svg%3e');
    border: 1px solid black;
    position: relative;

    .coords {
      position: absolute;
      top: 5px;
      right: 5px;
      color: black;
    }

    &.untraversable {
      opacity: 0;
      pointer-events: none;
    }
  }
</style>
