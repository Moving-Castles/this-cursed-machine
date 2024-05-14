<script lang="ts">
  import { blockNumber } from "@modules/network"
  import { materialMetadata } from "@modules/state/base/stores"
  import { playerOrder } from "@modules/state/simulated/stores"
  import { tutorialProgress } from "@modules/ui/assistant"
  import { blocksToReadableTime } from "@modules/utils"
  import { displayAmount } from "@modules/utils"
  import AccountKitBalance from "./account-kit-balance/AccountKitBalance.svelte"
</script>

<div
  class="order-bar"
  class:hidden={$tutorialProgress < 1}
  class:emphasis={$tutorialProgress === 4}
>
  <!-- ORDER INFORMATION -->
  <div class="order-information">
    <!-- GOAL -->
    <div class="goal">
      <span class="inverted" class:order={$playerOrder}>ORDER</span>:
      {#if !$playerOrder}
        NONE
      {:else}
        {displayAmount($playerOrder?.order.amount)}
        {$materialMetadata[$playerOrder?.order.materialId]?.name} →
        {displayAmount($playerOrder?.order.reward)} $BUGS
      {/if}
    </div>

    <!-- ORDER AVAILABILITY -->
    <!-- Don't show if maxPlayers is 0, meaning infinite players -->
    {#if $playerOrder?.order.maxPlayers ?? 0 !== 0}
      {#if $playerOrder?.completedPlayers === $playerOrder?.order.maxPlayers}
        <div class="exhausted">exhausted</div>
      {:else}
        <div class="inverted available">
          {$playerOrder?.order.maxPlayers -
            ($playerOrder?.completedPlayers ?? 0)}/
          {$playerOrder?.order.maxPlayers}
          available
        </div>
      {/if}
    {/if}

    <!-- TIME REMAINING -->
    <!-- Don't show if expirationBlock is 0, meaning no exipration -->
    {#if $playerOrder && $playerOrder.order.expirationBlock > 0}
      <div class="time">
        {blocksToReadableTime(
          Number($playerOrder.order.expirationBlock) - Number($blockNumber),
        )}
      </div>
    {/if}
  </div>

  <!-- SIGNER WALLET MODAL -->
  <div>
    <AccountKitBalance />
  </div>
</div>

<style lang="scss">
  .inverted {
    padding: 2px;
    background: var(--foreground);
    color: var(--background);

    &.order {
      animation: order-pulse 1s ease infinite alternate;
    }
  }

  @keyframes order-pulse {
    0% {
      background: var(--foreground);
      color: var(--background);
    }
    100% {
      background: var(--color-success);
      color: var(--background);
    }
  }

  .order-bar {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-inline: 15px;
    user-select: none;

    .order-information {
      display: flex;

      .goal {
        margin-right: 20px;
        text-wrap: none;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .exhausted {
        padding: 2px;
        padding-top: 3px;
        background: var(--color-failure);
        color: var(--background);
        line-height: 1em;
        font-size: var(--font-size-small);
        margin-right: 20px;
      }

      .available {
        padding: 2px;
        padding-top: 3px;
        background: var(--color-success);
        color: var(--background);
        font-size: var(--font-size-small);
        line-height: 1em;
        margin-right: 20px;

        @media screen and (max-width: 1250px) {
          display: none;
        }
      }

      .time {
        padding: 2px;
        padding-top: 3px;
        font-size: var(--font-size-small);
        background: var(--foreground);
        color: var(--background);
        line-height: 1em;

        @media screen and (max-width: 1330px) {
          display: none;
        }
      }
    }
  }
</style>
