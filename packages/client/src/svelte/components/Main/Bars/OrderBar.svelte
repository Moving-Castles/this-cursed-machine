<script lang="ts">
  import { blockNumber } from "@modules/network"
  import { materialMetadata, player } from "@modules/state/base/stores"
  import { playerOrder } from "@modules/state/simulated/stores"
  import { tutorialProgress } from "@modules/ui/assistant"
  import { blocksToReadableTime } from "@modules/utils"
  import { UI_SCALE_FACTOR } from "@modules/ui/constants"
</script>

<div
  class="order-bar"
  class:hidden={$tutorialProgress < 1}
  class:emphasis={$tutorialProgress === 4}
>
  <!-- ORDER INFORMATION -->
  <div class="order-information">
    <div class="goal">
      <span class="inverted">ORDER:</span>
      {#if !$playerOrder}
        NONE
      {:else}
        {$playerOrder?.order.amount / UI_SCALE_FACTOR}
        {$materialMetadata[$playerOrder?.order.materialId]?.name}
      {/if}
    </div>

    {#if $playerOrder && $playerOrder.order.expirationBlock > 0}
      <div class="time">
        {blocksToReadableTime(
          Number($playerOrder.order.expirationBlock) - Number($blockNumber)
        )}
      </div>
    {/if}
  </div>

  <div class="completed-orders">
    <span class="inverted">COMPLETED:</span>
    {$player.completed?.length ?? 0}
  </div>
</div>

<style lang="scss">
  .inverted {
    padding: 2px;
    background: var(--foreground);
    color: var(--background);
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
        background: var(--color-success);
        color: var(--background);
      }
    }

    .completed-orders {
      // height: 100%;
      // border-left: 4px double var(--color-grey-dark);
    }
  }
</style>
