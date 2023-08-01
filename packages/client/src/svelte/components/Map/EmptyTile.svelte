<script lang="ts">
  import { NULL_COORDINATE, dropDestination } from "../../modules/state"
  import { showInventory } from "../../modules/ui/stores"
  export let untraversable = false

  const onDrop = (e) => {
    console.log(e.dataTransfer.getData("text"))
    dropDestination.set(NULL_COORDINATE)
  }

  const onClick = () => {
  $showInventory = true
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  on:dragenter|preventDefault
  on:dragover|preventDefault
  on:drop|preventDefault={onDrop}
  on:click={onClick}
  class:untraversable
  class="empty-tile"
/>

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
    }
  }

  .untraversable {
    // opacity: 0;
  }
</style>
