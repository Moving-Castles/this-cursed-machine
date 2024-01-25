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
    background: #3a6f3a;
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 10;
    font-size: 10px;
    max-height: calc(100vh - 40px);
    overflow-y: scroll;
  }
</style>
