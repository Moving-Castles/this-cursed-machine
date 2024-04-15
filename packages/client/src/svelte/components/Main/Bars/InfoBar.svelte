<script lang="ts">
  import { player, playerTokenBalance } from "@modules/state/base/stores"
  import { tutorialProgress } from "@modules/ui/assistant"
  import NumberGoingUp from "@components/Main/Atoms/NumberGoingUp.svelte"
</script>

<div
  class:emphasis={$tutorialProgress === 6 || $tutorialProgress === 14}
  class="info-bar"
>
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
      <div class="token-balance">
        <NumberGoingUp value={$playerTokenBalance} /> $BUGS
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
