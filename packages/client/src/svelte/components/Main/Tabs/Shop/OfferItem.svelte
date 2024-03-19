<script lang="ts">
  import { player } from "@modules/state/base/stores"
  import { fade } from "svelte/transition"
  import { MATERIAL_TYPE } from "contracts/enums"
  import { buy } from "@modules/action"
  import { waitForCompletion } from "@modules/action/actionSequencer/utils"
  import { playSound } from "@modules/sound"

  export let key: string
  export let offer: Offer

  let working = false

  $: unafforable = (offer.offer?.cost ?? 0) > ($player.tokenBalances ?? 0)

  async function sendBuy() {
    working = true
    playSound("tcm", "listPrint")
    const action = buy(key)
    await waitForCompletion(action)
    playSound("tcm", "TRX_yes")
    working = false
  }
</script>

<div class="offer-item" class:working transition:fade>
  {#if offer?.offer}
    <div class="section material">
      {offer.offer.amount / 100}
      {MATERIAL_TYPE[offer.offer.materialType]}
    </div>

    <div class="section cost">
      {offer.offer.cost}P
    </div>

    <div class="section buy">
      <button class:unafforable on:click={() => sendBuy()}>
        {unafforable ? "Too expensive" : "Buy"}
      </button>
    </div>
  {/if}
</div>

<style lang="scss">
  .offer-item {
    width: 100%;
    border-bottom: 4px double var(--foreground);
    padding: 10px;
    padding-top: 30px;
    padding-bottom: 30px;

    &:first-child {
      border-top: 4px double var(--foreground);
    }

    display: flex;

    &.working {
      opacity: 0.5;
      pointer-events: none;
    }

    .section {
      user-select: none;

      &.material {
        width: 40%;
      }

      &.cost {
        width: 40%;
      }

      &.buy {
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

          &.unafforable {
            background: red;
            pointer-events: none;
          }
        }
      }
    }
  }
</style>
