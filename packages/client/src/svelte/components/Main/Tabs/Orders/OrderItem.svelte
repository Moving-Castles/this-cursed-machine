<script lang="ts">
  import { fade } from "svelte/transition"
  import { blockNumber } from "@modules/network"
  import { MATERIAL_TYPE } from "contracts/enums"
  import { accept, unaccept } from "@modules/action"
  import { blocksToReadableTime } from "@modules/utils"
  import { waitForCompletion } from "@modules/action/actionSequencer/utils"
  import { tutorialProgress } from "@modules/ui/assistant"
  import { playSound } from "@modules/sound"

  export let key: string
  export let order: Order
  export let active: boolean
  export let completed: boolean

  let working = false

  const PULSE_CONDITIONS = [2, 8, 16]

  async function sendAccept() {
    working = true
    playSound("tcm", "listPrint")
    const action = accept(key)
    await waitForCompletion(action)
    playSound("tcm", "TRX_yes")
    working = false
  }

  async function sendUnaccept() {
    working = true
    playSound("tcm", "listPrint")
    const action = unaccept()
    await waitForCompletion(action)
    playSound("tcm", "TRX_yes")
    working = false
  }
</script>

<div
  class="order-item"
  class:working
  class:active
  class:completed
  transition:fade
>
  {#if order?.order}
    <div class="section goal">
      {order.order.goalAmount / 100}
      {MATERIAL_TYPE[order.order.goalMaterialType]}
    </div>

    <div class="section reward">
      {order.order.rewardAmount}P
    </div>

    <div class="section time">
      {#if Number(order.order.expirationBlock) > 0}
        {blocksToReadableTime(
          Number(order.order.expirationBlock) - Number($blockNumber),
        )}
      {/if}
    </div>

    {#if !completed}
      {#if active}
        <div class="section accept">
          <button on:click={() => sendUnaccept()}>Cancel</button>
        </div>
      {:else}
        <div class="section accept">
          <button
            class:pulse={PULSE_CONDITIONS.includes($tutorialProgress)}
            on:click={() => sendAccept()}>Accept</button
          >
        </div>
      {/if}
    {/if}
  {/if}
</div>

<style lang="scss">
  .order-item {
    width: 100%;
    border-bottom: 4px double var(--foreground);
    padding: 10px;
    padding-top: 30px;
    padding-bottom: 30px;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(10px);

    &.working {
      opacity: 0.5;
      pointer-events: none;
    }

    &:first-child {
      border-top: 4px double var(--foreground);
    }

    display: flex;

    &.active {
      background: var(--foreground);
      color: var(--background);
    }

    &.completed {
      opacity: 0.3;
    }

    .section {
      &.goal {
        width: 50%;
      }

      &.reward {
        width: 10%;
      }

      &.time {
        width: 20%;
      }

      &.accept {
        width: 20%;

        button {
          width: 100%;
          height: 100%;
          background: grey;
          border: 0;
          font-family: var(--font-family);

          &:hover {
            background: var(--foreground);
            color: var(--background);
            cursor: pointer;
          }
        }
      }
    }
  }
</style>
