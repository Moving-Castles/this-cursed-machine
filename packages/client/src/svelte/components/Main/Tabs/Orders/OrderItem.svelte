<script lang="ts">
  import { onMount, createEventDispatcher } from "svelte"
  import { fade } from "svelte/transition"
  import { materialMetadata, player } from "@modules/state/base/stores"
  import { blockNumber } from "@modules/network"
  import { acceptOrder, unacceptOrder } from "@modules/action"
  import { blocksToReadableTime } from "@modules/utils"
  import { waitForCompletion } from "@modules/action/actionSequencer/utils"
  import { tutorialProgress } from "@modules/ui/assistant"
  import { orderAcceptInProgress } from "@modules/ui/stores"
  import { playSound } from "@modules/sound"
  import { staticContent } from "@modules/content"
  import { urlFor } from "@modules/content/sanity"
  import { players } from "@modules/state/base/stores"
  import { displayAmount } from "@modules/utils"

  import Spinner from "@components/Main/Atoms/Spinner.svelte"

  export let key: string
  export let order: Order
  // The order is currently accepted
  export let active = false
  // Player has completed this order, and can't accept it again
  export let completed: boolean
  // Player has selected the order in the UI
  export let selected: boolean

  const dispatch = createEventDispatcher()

  const name = $materialMetadata[order.order.materialId]?.name
  const spacedName = name?.replaceAll("_", " ")

  const PULSE_CONDITIONS = [5, 15, 25]

  // Get the order metadata from the database
  const staticMaterial =
    $staticContent.materials.find(material => material.materialType === name) ??
    {}
  const imageURL =
    staticMaterial && staticMaterial.image
      ? urlFor(staticMaterial.image).width(400).auto("format").url()
      : ""

  // Player is in the process of accepting the order
  $: working = $orderAcceptInProgress === key
  // Player is in the process of accepting another order
  $: unavailable =
    $orderAcceptInProgress !== key && $orderAcceptInProgress !== "0x0"

  async function sendAccept() {
    $orderAcceptInProgress = key
    playSound("tcm", "listPrint")
    const action = acceptOrder(key)
    await waitForCompletion(action)
    playSound("tcm", "TRX_yes")
    $orderAcceptInProgress = "0x0"
  }

  async function sendUnaccept() {
    $orderAcceptInProgress = key
    playSound("tcm", "listPrint")
    const action = unacceptOrder()
    await waitForCompletion(action)
    playSound("tcm", "TRX_yes")
    $orderAcceptInProgress = "0x0"
  }

  const onKeyPress = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      // Abort if the order system is busy
      if (working || unavailable || active || !selected || completed) return
      // Otherwise, accept the order
      sendAccept()
    }
  }

  // Get the number of players working on this order
  $: stumps = Object.entries($players).filter(([_, p]) => {
    return p.currentOrder === key
  })

  onMount(() => {
    if (active) {
      // Scroll to the active element first
      dispatch("scroll")
    }
  })
</script>

<svelte:window on:keypress={onKeyPress} />

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  on:mouseenter
  class="order-item"
  class:working
  class:unavailable
  class:active
  class:completed
  class:selected
  transition:fade
>
  {#if order?.order}
    {#if active}
      <div class="overlay" />
    {/if}
    <div class="material">
      {#if imageURL}
        <img
          class="overlay"
          src="/images/tcm2.png"
          alt="PROPERTY OF TCM CORP"
        />
        <img
          class="material-image"
          crossorigin="anonymous"
          src={imageURL}
          alt="{spacedName} SPECIMEN"
        />
      {:else}
        <img
          class="overlay"
          src="/images/tcm2.png"
          alt="PROPERTY OF TCM CORP"
        />
        <span class="specimen">
          MISSING<br />
          {spacedName}<br />
          SPECIMEN
        </span>
      {/if}
    </div>

    <div class="inner">
      <div class="top">
        <div class="col col-order">
          <p class="header">
            {#if working}
              <Spinner />
            {:else}
              Order #{key.slice(-6)}
            {/if}
          </p>
          <div class="content">
            <div class="center">
              {displayAmount(order.order.amount)}
              {spacedName}
            </div>
            <p class="subtitle">
              {#if staticMaterial.category}
                {#each staticMaterial.category as category, i}
                  <span class="category">{category}</span
                  >{#if i < staticMaterial.category.length - 1},{/if}
                {/each}
              {/if}
            </p>
          </div>
        </div>

        <div class="col col-reward">
          <p class="header">Reward</p>
          <div class="content">
            <div class="center">
              {displayAmount(order.order.reward)}<br />
              <p class="bugs">$BUGS</p>
            </div>
          </div>
        </div>

        <div class="col col-actions">
          <p class="header">
            {#if !$player.tutorial && order.order.expirationBlock != 0}
              {blocksToReadableTime(
                Number(order.order.expirationBlock) - Number($blockNumber),
              )}
            {/if}
          </p>
          <div class="content">
            <div class="center">
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
      </div>

      <div class="bottom">
        <p class="stumps" class:active={stumps.length > 0}>
          {#if working}
            <Spinner />
          {:else}
            {stumps.length} stump{stumps.length !== 1 ? "s" : ""} at work
          {/if}
        </p>
        <p>
          {#if working}
            <Spinner />
          {:else if order.order.maxPlayers === 0}
            {order?.completed?.length || 0} stumps completed
          {:else}
            {order.order.maxPlayers - (order?.completed?.length || 0)}/50
            available
          {/if}
        </p>
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
    flex-direction: row;
    justify-content: space-between;
    align-items: stretch;
    height: auto;
    margin-bottom: 20px;
    background: var(--color-grey-dark);
    padding: 1rem;
    gap: 1rem;

    > .overlay {
      position: absolute;
      inset: 0;
      z-index: 1;
      pointer-events: none;
      animation: 5s active ease infinite;
    }

    &.selected {
      border: 1px solid var(--color-success);
    }

    &.completed {
      opacity: 0.3;
    }

    &.working {
      pointer-events: none;
    }

    &.unavailable {
      pointer-events: none;
      opacity: 0.5;
    }

    .material {
      width: 200px;
      height: 200px;
      flex-shrink: 0;
      border: 1px solid var(--color-white);
      font-size: var(--font-size-small);
      position: relative;
      border: 1px solid var(--foreground);

      .material-image,
      .overlay {
        width: 100%;
        height: 100%;
        position: absolute;
        inset: 0;
      }

      .overlay {
        z-index: var(--z-10);
      }
      // transform: rotate(-45deg);

      .specimen {
        position: absolute;
        width: 100%;
        top: 50%;
        left: 50%;
        text-align: center;
        transform: translate(-50%, -50%) rotate(45deg);
        z-index: 0;
        color: var(--color-failure);
      }
    }

    .inner {
      width: 100%;
      display: flex;
      flex-flow: column nowrap;
      justify-content: space-between;

      .top {
        display: flex;
        justify-content: space-between;
        height: 100%;

        .col {
          display: flex;
          flex-flow: column nowrap;
          justify-content: space-between;
          height: 100%;

          &.col-order {
            width: 200px;
          }

          &.col-actions {
            align-items: flex-end;
          }

          .header {
            font-size: var(--font-size-small);
            margin-top: 0.2rem;
            margin-bottom: 2rem;
          }

          .content {
            height: 100%;

            .center {
              margin-bottom: 1rem;
              font-size: var(--font-size-large);
              height: calc(var(--font-size-large) * 4);
              // color: white;
            }
          }

          .category {
            text-decoration: underline;
          }

          .bugs,
          .subtitle {
            font-size: var(--font-size-small);
          }

          .bugs {
            color: var(--color-success);
          }
        }
      }

      .bottom {
        display: flex;
        font-size: var(--font-size-small);
        justify-content: space-between;

        .stumps {
          &.active {
            color: var(--color-success);
          }
        }
      }
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
  }

  button {
    background: var(--color-grey-mid);
    border: 0;
    height: 30px;
    font-family: var(--font-family);
    font-size: var(--font-size-large);
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

  @keyframes active {
    0%,
    100% {
      background-color: transparent;
    }

    50% {
      background-color: rgba(146, 250, 59, 0.2);
    }
  }
</style>
