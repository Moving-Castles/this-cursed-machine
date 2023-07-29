<script lang="ts">
  import { playerEntityId, calculatedEnergy } from "../../modules/state"
  import { onDragStart } from "../../modules/ui/events"
  export let entity: EntityStoreEntry

  const onClick = (e) => {
    console.log('explain core')
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="core"
  class:player={entity.address === $playerEntityId}
  draggable={entity.address === $playerEntityId}
  on:click={onClick}
  on:dragstart={(e) => onDragStart(e, entity.entity.position)}
>
  <div>
    <div class="name">{entity.entity.name} {entity.address === $playerEntityId ? "(U)" : ""}</div>
    <div class="energy">{$calculatedEnergy[entity.address]}</div>
  </div>
</div>

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
