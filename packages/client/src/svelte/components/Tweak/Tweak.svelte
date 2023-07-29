<script>
  import { config } from "../../modules/content/lore"
</script>

<div class="tweak">
  <label>Janky</label>
  <input type="checkbox" bind:checked={$config.janky}>
</div>

<style>
  .tweak {
    position: fixed;
    bottom: 0;
    right: 0;
    padding: 20px;
    z-index: 9999;
  }
</style>