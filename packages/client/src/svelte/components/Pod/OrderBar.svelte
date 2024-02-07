<script lang="ts">
  import { blockNumber } from "../../modules/network"
  import { orders, playerPod } from "../../modules/state"
  import { MATERIAL_TYPE } from "../../modules/state/enums"

  let currentOrder: Order = null
  $: currentOrder = $orders[$playerPod.currentOrder]
</script>

<div class="order-bar">
  <div>
    {#if !currentOrder}
      NO ORDER
    {:else}
      CURRENT ORDER:
      {currentOrder?.order.goalAmount}
      {MATERIAL_TYPE[currentOrder?.order.goalMaterialType]}
    {/if}
  </div>
  {#if currentOrder?.order.duration > 0}
    <div>
      REMAINING TIME: {Number(currentOrder.order.creationBlock) +
        Number(currentOrder.order.duration) -
        Number($blockNumber)}
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
