<script lang="ts">
  import { setContext } from "svelte"
  import BuildableOrganComponent from "./Organs/BuildableOrgan.svelte"

  export let tile: GridTile

  setContext("tile", tile)

  const onDragOver = e => {
    // dropDestination.set(tile.coordinates)
    console.log('inv drag', tile.coordinates)
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="inventory-tile" on:dragenter={onDragOver}>
  <BuildableOrganComponent background={"yellow"} type={tile.type}>
    <svelte:fragment slot="content">
      {tile.type}
    </svelte:fragment>
  </BuildableOrganComponent>
</div>

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
