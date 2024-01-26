<script lang="ts">
  import { storages } from "../../modules/state"
  import StorageItem from "./StorageItem.svelte"
</script>

<div class="storage-box">
  {#each Object.entries($storages) as [key, storage], index}
    <StorageItem {key} {storage} {index} />
  {/each}
</div>

<style lang="scss">
  .storage-box {
    padding: 20px;
    width: 100%;
    height: 100%;
    z-index: 10;
    max-height: calc(100vh - 40px);
    overflow-y: scroll;
    display: flex;
    align-items: center;
  }
</style>
