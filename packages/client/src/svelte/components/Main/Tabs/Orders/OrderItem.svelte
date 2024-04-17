<script lang="ts">
  import { fade } from "svelte/transition"
  import { player } from "@modules/state/base/stores"
  import { blockNumber } from "@modules/network"
  import { MATERIAL_TYPE } from "contracts/enums"
  import { accept, unaccept } from "@modules/action"
  import { blocksToReadableTime } from "@modules/utils"
  import { waitForCompletion } from "@modules/action/actionSequencer/utils"
  import { tutorialProgress } from "@modules/ui/assistant"
  import { playSound } from "@modules/sound"
  import { UI_SCALE_FACTOR } from "@modules/ui/constants"
  import { staticContent } from "@modules/content"
  import { urlFor } from "@modules/content/sanity"

  import Spinner from "@components/Main/Atoms/Spinner.svelte"

  export let key: string
  export let order: Order
  export let active: boolean
  export let completed: boolean

  let working = false

  const PULSE_CONDITIONS = [2, 8, 16]

  const staticMaterial = $staticContent.materials.find(
    material =>
      material.materialType === MATERIAL_TYPE[order.order.materialType]
  )
  const imageURL =
    staticMaterial && staticMaterial.image
      ? urlFor(staticMaterial.image).width(400).auto("format").url()
      : ""

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
    <div class="title">
      <div>
        {#if working}
          <Spinner />
        {:else}
          {order.order.title}
        {/if}
      </div>

      <div>
        <!-- {#if Number(order.order.expirationBlock) > 0} -->
        {#if working}
          <Spinner />
        {:else if !$player.tutorial}
          {blocksToReadableTime(
            Number(order.order.expirationBlock) - Number($blockNumber)
          )}
        {/if}
        <!-- {/if} -->
      </div>
    </div>

    <div class="main">
      <div class="image">
        <img crossorigin="anonymous" src={imageURL} alt="material" />
      </div>
      <div class="text">
        <div>
          {#if working}
            <Spinner />
          {:else}
            <span class="goal">
              {order.order.amount / UI_SCALE_FACTOR}
              {MATERIAL_TYPE[order.order.materialType]}
            </span>
            <span class="divider">→</span>
            <span class="reward">
              {order.order.reward} $BUGS
            </span>
          {/if}
        </div>

        <div class="section interaction">
          {#if active}
            <button class="cancel" on:click={() => sendUnaccept()}
              >Cancel</button
            >
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
      </div>
    </div>
  {/if}
</div>

<style lang="scss">
  .order-item {
    width: 100%;
    border-top: 1px solid var(--foreground);
    border-bottom: 1px solid var(--foreground);
    border-right: 1px solid var(--color-grey-dark);
    border-left: 1px solid var(--color-grey-dark);
    backdrop-filter: blur(5px);
    display: flex;
    flex-direction: column;
    height: 240px;
    margin-bottom: 20px;
    background: var(--color-grey-dark);

    &.working {
      pointer-events: none;
    }

    &.active {
      border: 1px solid var(--color-success);
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

    .title {
      width: 100%;
      padding-inline: 20px;
      padding-top: 10px;
      display: flex;
      justify-content: space-between;
      color: var(--color-grey-light);
    }

    .main {
      height: calc(100% - 30px);
      display: flex;
      justify-content: space-between;
      align-items: center;
      // background: yellow;

      .image {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 200px;

        img {
          height: 160px;
          width: 160px;
          border: 1px solid var(--foreground);
          // mix-blend-mode: lighten;
        }
      }

      .text {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: calc(100% - 180px);
        padding-left: 20px;
        padding-right: 20px;

        .goal,
        .reward {
          // font-size: 20px;
          font-family: var(--font-family);
          background: var(--foreground);
          color: var(--background);
          height: 30px;
          line-height: 30px;
          display: inline-block;
          padding-inline: 10px;
        }

        .divider {
          margin: 0 5px;
        }
      }
    }

    &.completed {
      opacity: 0.3;
    }

    .section {
      &.interaction {
        button {
          background: var(--color-grey-mid);
          border: 0;
          height: 30px;
          font-family: var(--font-family);
          padding: 0;
          padding-inline: 20px;

          &.accept {
            background: var(--color-success);
          }

          &.cancel {
            background: var(--color-grey-light);
          }

          &:hover {
            opacity: 0.8;
            cursor: pointer;
          }
        }
      }
    }
  }
</style>
