<script lang="ts">
  import { blockNumber } from "@modules/network"
  import { player } from "@modules/state/base/stores"
  import { playerOrder } from "@modules/state/simulated/stores"
  import { tutorialProgress } from "@modules/ui/assistant"
  import { MATERIAL_TYPE } from "@modules/state/base/enums"
  import { blocksToReadableTime } from "@modules/utils"
  import NumberGoingUp from "@svelte/components/Main/Atoms/NumberGoingUp.svelte"
  import { reward, charge } from "@modules/action"

  const sendReward = () => {
    reward()
  }

  const sendCharge = () => {
    charge()
  }
</script>

<div class="order-bar" class:hidden={$tutorialProgress < 4}>
  <!-- ORDER INFORMATION -->
  <div class="order-information">
    <div class="goal">
      ORDER:
      {#if !$playerOrder}
        NONE
      {:else}
        {$playerOrder?.order.goalAmount / 100}
        {MATERIAL_TYPE[$playerOrder?.order.goalMaterialType]}
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

  <!-- TOKEN BALANCE -->
  <div class="token-balance">
    POINTS: <NumberGoingUp
      value={$player.tokenBalances ?? 0}
      goal={30000}
      warn={26900}
    />
    <!-- <button on:click={sendReward}>Reward</button>
    <button on:click={sendCharge}>Charge</button> -->
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
