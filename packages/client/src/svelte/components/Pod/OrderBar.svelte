<script lang="ts">
  import { orders, playerPod } from "../../modules/state"
  import { MaterialType } from "../../modules/state/enums"

  $: console.log($orders[$playerPod.currentOrder])
</script>

<div class="order-bar">
  <div>
    CURRENT ORDER:
    {$orders[$playerPod.currentOrder]?.order.goalAmount}
    {MaterialType[$orders[$playerPod.currentOrder]?.order.goalMaterialType]}
  </div>
  {#if $orders[$playerPod.currentOrder]?.order.duration > 0}
    <div>REMAINING TIME:</div>
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
