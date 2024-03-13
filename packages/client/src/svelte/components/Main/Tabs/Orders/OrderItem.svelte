<script lang="ts">
  import { fade } from "svelte/transition"
  import { blockNumber } from "@modules/network"
  import { MATERIAL_TYPE } from "contracts/enums"
  import { accept } from "@modules/action"
  import { blocksToReadableTime } from "@modules/utils"

  export let key: string
  export let order: Order
  export let active: boolean

  $: remainingTime = blocksToReadableTime(
    Number(order.order.expirationBlock) - Number($blockNumber),
  )

  function sendAccept() {
    accept(key)
  }
</script>

<div class="order-item" class:active transition:fade>
  <div class="section description">
    {order.order.goalAmount / 100}
    {MATERIAL_TYPE[order.order.goalMaterialType]}
  </div>

  <div class="section time">
    {remainingTime}
  </div>

  {#if !active}
    <div class="section accept">
      <button on:click={() => sendAccept()}>Accept</button>
    </div>
  {/if}
</div>

<style lang="scss">
  .order-item {
    width: 100%;
    border-bottom: 1px solid white;
    padding: 10px;
    padding-top: 30px;
    padding-bottom: 30px;

    display: flex;

    &.active {
      background: red;
    }

    .section {
      &.description {
        width: 40%;
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
            background: white;
            color: black;
            cursor: pointer;
          }
        }
      }
    }
  }
</style>
