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
    <div class="goal">
      <span class="inverted" class:order={$playerOrder}>ORDER:</span>
      {#if !$playerOrder}
        NONE
      {:else}
        {displayAmount($playerOrder?.order.amount)}
        {$materialMetadata[$playerOrder?.order.materialId]?.name}
      {/if}
    </div>

    {#if $playerOrder && $playerOrder.order.expirationBlock > 0}
      <div class="time">
        {blocksToReadableTime(
          Number($playerOrder.order.expirationBlock) - Number($blockNumber),
        )}
      </div>
    {/if}
  </div>

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
      background: var(--color-success);
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
      }

      .time {
        padding: 2px;
        font-size: var(--font-size-small);
        background: var(--foreground);
        color: var(--background);
      }
    }

    .completed-orders {
      // height: 100%;
      // border-left: 4px double var(--color-grey-dark);
    }
  }
</style>
