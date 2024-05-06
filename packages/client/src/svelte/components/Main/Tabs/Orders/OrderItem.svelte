<script lang="ts">
  import { onMount, createEventDispatcher } from "svelte"
  import { fade } from "svelte/transition"
  import {
    materialMetadata,
    player,
    gameConfig,
    players,
  } from "@modules/state/base/stores"
  import { MATERIAL_DIFFICULTY } from "contracts/enums"
  import { playerNames } from "@modules/state/base/stores"
  import { discoveredMessages } from "@modules/state/simulated/stores"
  import { blockNumber } from "@modules/network"
  import { acceptOrder, unacceptOrder } from "@modules/action"
  import {
    blocksToReadableTime,
    shortenAddress,
    addressToId,
  } from "@modules/utils"
  import { waitForCompletion } from "@modules/action/actionSequencer/utils"
  import { tutorialProgress } from "@modules/ui/assistant"
  import { orderAcceptInProgress } from "@modules/ui/stores"
  import { playSound } from "@modules/sound"
  import { staticContent } from "@modules/content"
  import { urlFor } from "@modules/content/sanity"
  import { displayAmount } from "@modules/utils"

  import Spinner from "@components/Main/Atoms/Spinner.svelte"

  // ID of the order
  export let key: string
  // The order object
  export let order: Order
  // The order is currently accepted
  export let active = false
  // Player has completed this order, and can't accept it again
  export let completed: boolean
  // Player has selected the order in the UI
  export let selected: boolean

  const dispatch = createEventDispatcher()

  const name = $materialMetadata[order.order.materialId]?.name
  const difficulty =
    MATERIAL_DIFFICULTY[$materialMetadata[order.order.materialId]?.difficulty]
  const spacedName = name?.replaceAll("_", " ")

  const getCreator = (order: Order) => {
    if (!order.order.creator) return "UNKNOWN"
    if (order.order.creator === $gameConfig.adminAddress) return "TCM Corp."
    if ($playerNames[addressToId(order.order.creator)]) {
      return $playerNames[addressToId(order.order.creator)]
    }

    return shortenAddress(order.order.creator)
  }

  const PULSE_CONDITIONS = [5, 15, 25]

  // Get the order metadata from the database
  const staticMaterial =
    $staticContent.materials.find(material => material.materialType === name) ??
    {}
  const imageURL =
    staticMaterial && staticMaterial.image
      ? urlFor(staticMaterial.image).width(200).auto("format").url()
      : ""

  // Player is in the process of accepting the order
  $: working = $orderAcceptInProgress === key
  // Player is in the process of accepting another order
  $: unavailable =
    $orderAcceptInProgress !== key && $orderAcceptInProgress !== "0x0"
  // Maximum number of players has been reached
  $: exhausted =
    order.order.maxPlayers > 0 &&
    (order.completedPlayers ?? 0) >= order.order.maxPlayers

  async function sendAccept() {
    $orderAcceptInProgress = key
    const action = acceptOrder(key)
    const s = playSound("tcm", "acceptOrderLoading", true)
    try {
      await waitForCompletion(action)
      s?.stop()
      playSound("tcm", "acceptOrderSuccess")

      // Now check the material of the order and
      // if the material has static content
      // Unlock the message
      if (
        staticMaterial?.hint &&
        order.order.creator === $gameConfig.adminAddress
      ) {
        discoveredMessages.set([
          ...$discoveredMessages,
          staticMaterial.hint._id,
        ])
      }
    } catch (error) {
      s?.stop()
      playSound("tcm", "acceptOrderFail")
    }
    $orderAcceptInProgress = "0x0"
  }

  async function sendUnaccept() {
    $orderAcceptInProgress = key
    const action = unacceptOrder()
    const s = playSound("tcm", "acceptOrderLoading", true)
    try {
      await waitForCompletion(action)
      s?.stop()
      playSound("tcm", "acceptOrderFail")
    } catch (error) {
      s?.stop()
      playSound("tcm", "acceptOrderFail")
    }
    $orderAcceptInProgress = "0x0"
  }

  const onKeyPress = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      // Abort if the order system is busy
      if (
        working ||
        unavailable ||
        exhausted ||
        active ||
        !selected ||
        completed
      )
        return
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
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  on:mouseenter
  class="order-item"
  class:working
  class:unavailable
  class:active
  class:completed
  class:selected
  class:exhausted
  on:click={() => {
    if (!completed && !unavailable && !working && !active) {
      sendAccept()
    }
  }}
  transition:fade
>
  {#if order?.order}
    {#if active}
      <div class="overlay" />
    {/if}

    {#if completed}
      <div class="blocking-overlay completed">
        <div>COMPLETED</div>
      </div>
    {:else if exhausted}
      <div class="blocking-overlay exhausted">
        <div>EXHAUSTED</div>
      </div>
    {/if}

    <!-- * * * * * * * * * * -->
    <!-- IMAGE -->
    <!-- * * * * * * * * * * -->
    <div class="material">
      {#if imageURL}
        <img
          class="overlay"
          src="/images/tcm2.png"
          alt="PROPERTY OF TCM CORP"
        />
        <img
          class="material-image"
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
          {staticMaterial?.title || spacedName}<br />
          SPECIMEN
        </span>
      {/if}
    </div>

    <!-- * * * * * * * * * * -->
    <!-- INNER -->
    <!-- * * * * * * * * * * -->
    <div class="inner">
      <!-- * * * * * * * * * * -->
      <!-- TOP-->
      <!-- * * * * * * * * * * -->
      <div class="top">
        <!-- * * * * * * * * * * -->
        <!-- FIRST COLUMN -->
        <!-- * * * * * * * * * * -->
        <div class="col col-order">
          <!-- * * * * * * * * * * -->
          <!-- ORDER CREATOR -->
          <!-- * * * * * * * * * * -->
          <div class="header">
            <span class="padded inverted">
              Creator: {getCreator(order)}
            </span>
          </div>
          <div class="content">
            <!-- * * * * * * * * * * * * * * * * -->
            <!-- AMOUNT, MATERIAL AND CATEGORIES -->
            <!-- * * * * * * * * * * * * * * * * -->
            <div class="center">
              {displayAmount(order.order.amount)}
              {staticMaterial?.title || spacedName}
              <div class="subtitle">
                {#if staticMaterial.category}
                  {#each staticMaterial.category as category, i}
                    <span class="padded inverted-low">{category}</span
                    >{#if i < staticMaterial.category.length - 1},{/if}
                  {/each}
                {/if}
              </div>
            </div>
          </div>
        </div>

        <!-- * * * * * * * * * * -->
        <!-- SECOND COLUMN -->
        <!-- * * * * * * * * * * -->
        <div class="col col-reward">
          <!-- * * * * * * * * * * -->
          <!-- REWARD -->
          <!-- * * * * * * * * * * -->
          <p class="header">
            <span class="padded inverted {difficulty}">
              DIFFICULTY: {difficulty}
            </span>
          </p>
          <div class="content">
            <div class="center">
              {displayAmount(order.order.reward)}<br />
              <p class="bugs">$BUGS</p>
            </div>
          </div>
        </div>

        <!-- * * * * * * * * * * -->
        <!-- THIRD COLUMN -->
        <!-- * * * * * * * * * * -->
        <div class="col col-actions">
          <!-- * * * * * * * * * * -->
          <!-- REMAINING TIME -->
          <!-- * * * * * * * * * * -->
          <p class="header">
            {#if !$player.tutorial && order.order.expirationBlock != BigInt(0)}
              <span class="padded inverted">
                {blocksToReadableTime(
                  Number(order.order.expirationBlock) - Number($blockNumber)
                )}
              </span>
            {/if}
          </p>
          <!-- * * * * * * * * * * -->
          <!-- BUTTONS -->
          <!-- * * * * * * * * * * -->
          <div class="content">
            <div class="center">
              {#if active}
                <button class="cancel" on:click={() => sendUnaccept()}
                  >CANCEL</button
                >
              {:else}
                <button
                  class:pulse={PULSE_CONDITIONS.includes($tutorialProgress)}
                  class="accept"
                  on:click={() => sendAccept()}
                >
                  ACCEPT
                </button>
              {/if}
            </div>
          </div>
        </div>
      </div>

      <!-- * * * * * * * * * * -->
      <!-- BOTTOM -->
      <!-- * * * * * * * * * * -->
      <div class="bottom">
        <!-- * * * * * * * * * * -->
        <!-- PLAYERS WORKING -->
        <!-- * * * * * * * * * * -->
        <p class="stumps" class:active={stumps.length > 0}>
          {#if working}
            <Spinner />
          {:else}
            {stumps.length} stump{stumps.length !== 1 ? "s" : ""} at work
          {/if}
        </p>
        <!-- * * * * * * * * * * -->
        <!-- PLAYERS COMPLETED -->
        <!-- * * * * * * * * * * -->
        <p>
          {#if working}
            <Spinner />
          {:else if order.order.maxPlayers === 0}
            {order?.completedPlayers ?? 0} stumps completed
          {:else}
            {order.order.maxPlayers - (order?.completedPlayers ?? 0)}/{order
              .order.maxPlayers}
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
    user-select: none;
    overflow: hidden;

    > .overlay {
      position: absolute;
      inset: 0;
      z-index: 1;
      animation: 5s active ease infinite;
      pointer-events: none;
    }

    &.selected {
      border: 1px solid var(--color-success);
    }

    .blocking-overlay {
      display: block;
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: var(--z-10);
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 42px;
      background: rgba(0, 0, 0, 0.7);

      &.exhausted {
        color: var(--color-failure);
      }

      &.completed {
        color: var(--color-success);
      }
    }

    &.completed {
      pointer-events: none;
    }

    &.working {
      pointer-events: none;
    }

    &.exhausted {
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
          // justify-content: space-between;
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
            height: 30%;
          }

          .content {
            height: 70%;
            .center {
              font-size: var(--font-size-large);
              height: calc(var(--font-size-large) * 4);
            }
          }

          .category {
            text-decoration: underline;
          }

          .bugs,
          .subtitle {
            margin-top: 6px;
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

  .padded {
    padding: 3px;
  }

  .inverted {
    background: var(--foreground);
    color: var(--background);

    &.NOVICE {
      background: var(--color-grey-mid);
      color: var(--white);
    }

    &.INTERMEDIATE {
      background: var(--color-success);
      color: var(--color-grey-dark);
    }

    &.ADVANCED {
      background: var(--color-tutorial);
      color: var(--color-grey-dark);
    }

    &.NIGHTMARE {
      background: var(--color-failure);
      color: var(--color-grey-dark);
    }
  }

  .inverted-low {
    background: var(--color-grey-light);
    color: var(--color-grey-dark);
  }
</style>
