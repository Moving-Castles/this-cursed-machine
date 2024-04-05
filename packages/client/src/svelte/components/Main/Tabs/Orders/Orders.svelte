<script lang="ts">
  import { playerPod, player } from "@modules/state/base/stores"
  import { availableOrders } from "@modules/state/base/stores"

  import OrderItem from "./OrderItem.svelte"
</script>

<div class="container">
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
  }
</style>
