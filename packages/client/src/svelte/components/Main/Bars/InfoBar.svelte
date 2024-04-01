<script lang="ts">
  import { player } from "@modules/state/base/stores"
  import { tutorialProgress } from "@modules/ui/assistant"
  import NumberGoingUp from "@svelte/components/Main/Atoms/NumberGoingUp.svelte"
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
    <div>
      <!-- TOKEN BALANCE -->
      <div class="token-balance">
        <NumberGoingUp
          value={$player.tokenBalances ?? 0}
          goal={30000}
          warn={26900}
        />P
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

    .tokens {
      display: flex;
      align-items: center;

      button {
        font-size: var(--font-size-small);
        padding: 5px;
        border: none;
        margin-left: 5px;
        margin-top: 0;
      }
    }
  }
</style>
