<script lang="ts">
  import { setContext } from "svelte"
  import BuildableOrganComponent from "./Organs/BuildableOrgan.svelte"
  import { BuildableEntityType, EntityType } from "../../modules/state/types"
  import { playerCanAffordOrgan, playerCanAffordControl } from "../../modules/state"
  import { build } from "../../modules/action"

  // export let tile: GridTile
  // const buildableEntity = getContext("buildableEntity") as BuildableEntity
  export let buildableEntity: buildableEntity
  const tile = getContext("tile") as GridTile
  console.log(buildableEntity, tile)
  const canAffordOrgan = playerCanAffordOrgan(buildableEntity.cost)

  import { getContext } from "svelte"
  // setContext("tile", tile)
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
  <button class="action organ" 
    disabled={ !$canAffordOrgan }
    on:click={() => build(buildableEntity.type, tile.coordinates.x, tile.coordinates.y)}>
    {buildableEntity.name}
  </button>

<style lang="scss">
  .inventory-tile {
    width: var(--tilesize);
    width: var(--tilesize);
    display: block;
    font-size: 8px;
    display: flex;
    margin-left: 10px;
    justify-content: center;
    align-items: center;
    background-size: contain;
    background: rgba(255, 255, 255, 0.2);
    // background-image: url('data:image/svg+xml,%3csvg width=\'100%25\' height=\'100%25\' xmlns=\'http://www.w3.org/2000/svg\'%3e%3crect width=\'100%25\' height=\'100%25\' fill=\'none\' stroke=\'%23333\' stroke-width=\'4\' stroke-dasharray=\'20%2c 7\' stroke-dashoffset=\'6\' stroke-linecap=\'square\'/%3e%3c/svg%3e');
    border: 1px solid black;
    position: relative;

    .type {
      position: absolute;
      top: 5px;
      right: 5px;
      color: black;
      width: 70px;
    }

    &.untraversable {
      opacity: 0;
    }
  }
</style>
