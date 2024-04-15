<script lang="ts">
  import { playerPod, player } from "@modules/state/base/stores"
  import { availableOrders } from "@modules/state/base/stores"
  import { tutorialProgress } from "@modules/ui/assistant"

  import OrderItem from "./OrderItem.svelte"
</script>

{#if $tutorialProgress > 3}
  <div class="container">
    <div class="order-list">
      {#each Object.entries($availableOrders) as [key, order]}
        <OrderItem
          {key}
          {order}
          active={$player.currentOrder === key}
          completed={$player.completed?.includes(key)}
        />
      {/each}
    </div>
  </div>
{/if}

<style lang="scss">
  .container {
    padding: 20px;
  }
</style>
