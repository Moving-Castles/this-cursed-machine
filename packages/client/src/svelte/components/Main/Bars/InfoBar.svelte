<script lang="ts">
  import { player } from "@modules/state/base/stores"
</script>

<div class="info-bar">
  <div class="name">
    {#if $player.name}
      {$player.name}
    {:else}
      Stump #{$player.spawnIndex}
    {/if}
  </div>

  <div class="completed">
    <div>COMPLETED: {$player.completed?.length ?? 0}</div>
  </div>
</div>

<style lang="scss">
  .info-bar {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-inline: 20px;

    .tokens {
      display: flex;
      align-items: center;

      button {
        font-size: 8px;
        padding: 5px;
        border: none;
        margin-left: 5px;
        margin-top: 0;
      }
    }
  }
</style>
