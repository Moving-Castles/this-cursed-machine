<script lang="ts">
  import { fade } from "svelte/transition"
  import { blockNumber } from "@modules/network"
  import { MATERIAL_TYPE } from "contracts/enums"
  import { accept, unaccept } from "@modules/action"
  import { blocksToReadableTime } from "@modules/utils"
  import { waitForCompletion } from "@modules/action/actionSequencer/utils"
  import { tutorialProgress } from "@modules/ui/assistant"
  import { playSound } from "@modules/sound"
  import { UI_SCALE_FACTOR } from "@modules/ui/constants"

  import Spinner from "@components/Main/Atoms/Spinner.svelte"

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
    <div class="section title">
      {#if working}
        <Spinner />
      {:else}
        {order.order.title}
      {/if}
    </div>

    <div class="section goal">
      {#if working}
        <Spinner />
      {:else}
        {order.order.amount / UI_SCALE_FACTOR}
        {MATERIAL_TYPE[order.order.materialType]}
      {/if}
    </div>

    <div class="section reward">
      {#if working}
        <Spinner />
      {:else}
        {order.order.reward} $BUGS
      {/if}
    </div>

    <div class="section time">
      {#if Number(order.order.expirationBlock) > 0}
        {#if working}
          <Spinner />
        {:else}
          {blocksToReadableTime(
            Number(order.order.expirationBlock) - Number($blockNumber),
          )}
        {/if}
      {/if}
    </div>

    {#if !completed}
      <div class="section interaction">
        {#if active}
          <button class="cancel" on:click={() => sendUnaccept()}>Cancel</button>
        {:else}
          <button
            class:pulse={PULSE_CONDITIONS.includes($tutorialProgress)}
            class="accept"
            on:click={() => sendAccept()}
          >
            Accept
          </button>
        {/if}
      </div>
    {/if}
  {/if}
</div>

<style lang="scss">
  .order-item {
    width: 100%;
    border-bottom: 1px solid var(--foreground);
    padding: 10px;
    padding-top: 30px;
    padding-bottom: 30px;
    backdrop-filter: blur(5px);
    display: flex;
    justify-content: space-between;
    align-items: center;

    &.working {
      opacity: 0.5;
      pointer-events: none;
    }

    &:first-child {
      border-top: 1px solid var(--foreground);
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
      &.title {
        width: 20%;
      }

      &.goal {
        width: 20%;
      }

      &.reward {
        width: 20%;
      }

      &.time {
        width: 20%;
      }

      &.interaction {
        width: 20%;

        button {
          width: 100%;
          height: 100%;
          background: var(--color-grey-mid);
          border: 0;
          height: 30px;
          font-family: var(--font-family);

          &.accept {
            background: var(--color-success);
          }

          &.cancel {
            background: var(--color-failure);
          }

          &:hover {
            opacity: 0.8;
            cursor: pointer;
          }
        }
      }
    }

    &.active {
      background: var(--color-success);
      color: var(--background);

      .section {
        &.accept {
          button {
            background: var(--color-grey-mid);
            &:hover {
              background: var(--background);
              color: var(--foreground);
            }
          }
        }
      }
    }
  }
</style>
