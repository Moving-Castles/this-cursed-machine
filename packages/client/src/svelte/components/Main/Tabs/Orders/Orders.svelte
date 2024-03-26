<script lang="ts">
  import { playerPod, player } from "@modules/state/base/stores"
  import { availableOrders, orders } from "@modules/state/base/stores"

  import OrderItem from "./OrderItem.svelte"

  // – show accepted order at top of list?
</script>

<div class="container">
  <div>ORDERS</div>
  <div class="order-list">
    {#each Object.entries($availableOrders) as [key, order]}
      <OrderItem
        {key}
        {order}
        active={$playerPod.currentOrder === key}
        completed={$player.completed?.includes(key)}
      />
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
