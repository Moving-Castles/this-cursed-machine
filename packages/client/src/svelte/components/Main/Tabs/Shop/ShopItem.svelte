<script lang="ts">
  import { player } from "@modules/state/base/stores"
  import { fade } from "svelte/transition"
  import { MATERIAL_TYPE } from "contracts/enums"
  import { buy } from "@modules/action"
  import { waitForCompletion } from "@modules/action/actionSequencer/utils"
  import { tutorialProgress } from "@modules/ui/assistant"
  import { playSound } from "@modules/sound"

  import Spinner from "@components/Main/Atoms/Spinner.svelte"

  export let key: string
  export let offer: Offer

  const PULSE_CONDITIONS = [10, 17]

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

<div class="shop-item" class:working in:fade>
  {#if offer?.offer}
    <div class="section material">
      <div>
        {#if working}
          <Spinner />
        {:else}
          {MATERIAL_TYPE[offer.offer.materialType]}
        {/if}
      </div>
      <div>
        {#if working}
          <Spinner />
        {:else}
          {offer.offer.amount / 100}
        {/if}
      </div>
    </div>

    <div class="section icon">
      <img src="/images/bug.gif" alt="material icon" />
    </div>

    <div class="section buy">
      <button
        class:unafforable
        class:pulse={PULSE_CONDITIONS.includes($tutorialProgress)}
        on:click={() => sendBuy()}
      >
        {offer.offer.cost}P
      </button>
    </div>
  {/if}
</div>

<style lang="scss">
  .shop-item {
    width: 300px;
    height: 300px;
    border: 1px solid var(--foreground);
    padding: 10px;
    padding-bottom: 30px;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(10px);
    margin-right: 20px;

    &.working {
      opacity: 0.5;
      pointer-events: none;
    }

    .section {
      user-select: none;
      width: 100%;

      &.material {
        border-bottom: 1px solid var(--foreground);
        padding-bottom: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 30px;
      }

      &.icon {
        height: 200px;
        padding-top: 10px;
        padding-bottom: 10px;
        display: flex;
        justify-content: center;
        align-items: center;

        img {
          width: 140px;
          aspect-ratio: 1;
          object-fit: cover;
        }
      }

      &.buy {
        height: 60px;
        border-top: 1px solid var(--foreground);
        padding-top: 10px;

        button {
          width: 100%;
          height: 36px;
          background: grey;
          border: 0;
          font-family: var(--font-family);

          &:hover {
            background: var(--foreground);
            color: var(--background);
            cursor: pointer;
          }

          &.unafforable {
            opacity: 0.3;
            pointer-events: none;
          }
        }
      }
    }
  }
</style>
