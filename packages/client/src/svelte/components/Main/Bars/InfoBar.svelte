<script lang="ts">
  import { player } from "@modules/state/base/stores"
  import NumberGoingUp from "@components/Main/Atoms/NumberGoingUp.svelte"
</script>

<div class="info-bar">
  <div class="name">
    <span class="name-inner">
      {#if $player.name}
        {$player.name}
      {:else}
        Stump #{$player.spawnIndex}
      {/if}
    </span>
  </div>

  <div class="completed">
    <div>
      <!-- TOKEN BALANCE -->
      <div class="token-balance">
        <NumberGoingUp
          value={$player.tokenBalances ?? 0}
          goal={30000}
          warn={26900}
        /> $BUGS
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  .info-bar {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-inline: 15px;
    user-select: none;

    .name {
      .name-inner {
        padding: 2px;
        background: var(--foreground);
        color: var(--background);
      }
    }
  }
</style>
