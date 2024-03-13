<script lang="ts">
  import { playerPod } from "@modules/state/base/stores"
  import { activeOrders } from "@modules/state/base/stores"

  import OrderItem from "./OrderItem.svelte"

  // - Grey out orders that have been completed by player
  // – show accepted order at top of list?
</script>

<div class="container">
  <div>ORDERS</div>
  <div class="order-list">
    {#each Object.entries($activeOrders) as [key, order]}
      <OrderItem {key} {order} active={key === $playerPod.currentOrder} />
    {/each}
  </div>
</div>

<style lang="scss">
  .container {
    padding: 20px;

    .order-list {
      margin-top: 40px;
    }
  }
</style>
