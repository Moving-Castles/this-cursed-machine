<script lang="ts">
  import { setContext } from "svelte"
  import {
    dropDestination,
    tileEntity
  } from "../../modules/state"
  import { EntityType } from "../../modules/state/types"
  import CoreComponent from "./Core.svelte"
  import OrganComponent from "./Organs/Organ.svelte"
  import EmptyTile from "./EmptyTile.svelte"
  import Claw from "./Organs/Claw.svelte"
  import FoodSource from "./Organs/FoodSource.svelte"
  import Portal from "./Organs/Portal.svelte"
  import ResourceSplit from "./Organs/ResourceSplit.svelte"
  import ControlSplit from "./Organs/ControlSplit.svelte"
  import Counter from "./Organs/Counter.svelte"
  import Modifier from "./Organs/Modifier.svelte"

  export let tile: GridTile

  setContext("tile", tile)

  const mappings = {
    // 0: Core,
    1: Claw,
    2: FoodSource,
    3: Portal,
    4: ResourceSplit,
    5: ControlSplit,
    6: Counter,
    7: Modifier
  }
  const colorMappings = {
    // 0: Core,
    1: 'blue',
    2: 'pink',
    3: 'yellow',
    4: 'darkorange',
    5: 'deepskyblue',
    6: 'darkviolet',
    7: 'tomato'
  }

  const onDragOver = e => {
    dropDestination.set(tile.coordinates)
  }

  const entity = tileEntity(tile.coordinates)
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="tile" on:dragenter={onDragOver}>
  <div class="coords">{tile.coordinates.x}, {tile.coordinates.y}</div>

  {#if $entity}
    {#if EntityType[$entity.entity.type] === "CORE"}
      <CoreComponent entity={$entity} />
    {:else}
      <OrganComponent background={colorMappings[$entity.entity.type]} entity={$entity}>
        <svelte:fragment slot="content">
          {EntityType[$entity.entity.type]}
        </svelte:fragment>

        <!-- Organ actions -->
        <svelte:component slot="modal" this={mappings[$entity.entity.type]} entity={$entity} />
      </OrganComponent>
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
  }
</style>
