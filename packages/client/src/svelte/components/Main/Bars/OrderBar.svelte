<script lang="ts">
  import { blockNumber } from "@modules/network"
  import {
    player,
    activeOrders,
    orders,
    playerPod,
  } from "@modules/state/base/stores"
  import { MATERIAL_TYPE } from "@modules/state/base/enums"
  import { blocksToReadableTime } from "@modules/utils"
  import NumberGoingUp from "@svelte/components/Atoms/NumberGoingUp.svelte"
  import { reward, charge } from "@modules/action"

  const sendReward = () => {
    reward()
  }

  const sendCharge = () => {
    charge()
  }

  let currentOrder: Order | null = null
  $: currentOrder = $player.tutorial
    ? $orders[$playerPod.currentOrder]
    : $activeOrders[$playerPod.currentOrder]
</script>

<div class="order-bar">
  <!-- ORDER INFORMATION -->
  <div class="order-information">
    <div class="goal">
      ORDER:
      {#if !currentOrder}
        NONE
      {:else}
        {currentOrder?.order.goalAmount / 100}
        {MATERIAL_TYPE[currentOrder?.order.goalMaterialType]}
      {/if}
    </div>

    {#if currentOrder && currentOrder.order.expirationBlock > 0}
      <div class="time">
        {blocksToReadableTime(
          Number(currentOrder.order.expirationBlock) - Number($blockNumber),
        )}
      </div>
    {/if}
  </div>

  <!-- TOKEN BALANCE -->
  <div class="token-balance">
    POINTS: <NumberGoingUp
      value={$player.tokenBalances ?? 0}
      goal={30000}
      warn={26900}
    />

    <button on:click={sendReward}>Reward</button>
    <button on:click={sendCharge}>Charge</button>
  </div>
</div>

<style lang="scss">
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
        background: var(--foreground);
        color: var(--background);
      }
    }
  }
</style>
