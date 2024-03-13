<script lang="ts">
  import { blockNumber } from "@modules/network"
  import { activeOrders, playerPod } from "@modules/state/base/stores"
  import { MATERIAL_TYPE } from "@modules/state/base/enums"
  import { blocksToReadableTime } from "@modules/utils"

  let currentOrder: Order | null = null
  $: currentOrder = $activeOrders[$playerPod.currentOrder]
</script>

<div class="order-bar">
  <div>
    {#if !currentOrder}
      NO ORDER
    {:else}
      CURRENT ORDER:
      {currentOrder?.order.goalAmount / 100}
      {MATERIAL_TYPE[currentOrder?.order.goalMaterialType]}
    {/if}
  </div>
  {#if currentOrder && currentOrder.order.expirationBlock > 0}
    <div>
      {blocksToReadableTime(
        Number(currentOrder.order.expirationBlock) - Number($blockNumber),
      )}
    </div>
  {/if}
</div>

<style lang="scss">
  .order-bar {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-inline: 20px;
  }
</style>
