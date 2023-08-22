<script lang="ts">
  import { playerEntityId } from "../../modules/state"
  import Connectable from "./Connectable.svelte"

  export let entity: EntityStoreEntry

  // What are the inputs and outputs for this entity

  // $: console.log(entity)
</script>

<Connectable {entity}>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    class="core"
    class:player={entity.address === $playerEntityId}
    draggable={entity.address === $playerEntityId}
  >
    <div>
      <div class="name">
        {entity.entity.name}
        {entity.address === $playerEntityId ? "(U)" : ""}
      </div>
      <!-- <div class="energy">{$calculatedEnergy[entity.address]}</div> -->
    </div>
  </div>
</Connectable>

<div id="placeholder" />

<style lang="scss">
  .core {
    background: rgb(54, 141, 240);
    width: 80%;
    height: 80%;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: 24px;
    overflow: hidden;
    z-index: 10000;
    text-align: center;

    .name {
      font-size: 8px;
      text-align: center;
      font-weight: bold;
    }

    &.player {
      border: 3px solid rgb(0, 0, 255);
    }
  }
</style>
