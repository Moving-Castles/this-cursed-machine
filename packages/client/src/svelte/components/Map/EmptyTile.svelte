<script lang="ts">
  import { NULL_COORDINATE, dropDestination } from "../../modules/state"

  const onDrop = (e) => {
    // console.log(e.dataTransfer.getData("text"))
    dropDestination.set(NULL_COORDINATE)
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  on:dragenter|preventDefault
  on:dragover|preventDefault
  on:drop|preventDefault={onDrop}
  on:click={onDrop}
  class="empty-tile"
/>

<style lang="scss">
  .empty-tile {
    width: 100%;
    height: 100%;
  }
</style>
