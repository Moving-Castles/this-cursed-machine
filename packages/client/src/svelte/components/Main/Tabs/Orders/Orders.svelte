<script lang="ts">
  import { fade } from "svelte/transition"
  import { orders, playerPod } from "@modules/state/base/stores"
  import { MATERIAL_TYPE } from "contracts/enums"
  import { accept } from "@modules/action"

  function sendAccept(orderId: string) {
    accept(orderId)
  }
</script>

<div class="container" in:fade>
  <div>ORDERS</div>
  {#each Object.entries($orders) as [key, order]}
    {#if !order.tutorial}
      <div class="order-item">
        {#if key === $playerPod.currentOrder}
          <span>(★)</span>
        {/if}
        {order.order.goalAmount / 100}
        {MATERIAL_TYPE[order.order.goalMaterialType]}
        <button on:click={() => sendAccept(key)}>Accept</button>
      </div>
    {/if}
  {/each}
</div>

<style lang="scss">
  .container {
    padding: 20px;

    .order-item {
      width: 100%;
      border-bottom: 1px solid white;
      padding: 10px;
    }
  }
</style>
