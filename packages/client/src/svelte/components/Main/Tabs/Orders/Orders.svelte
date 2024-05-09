<script lang="ts">
  import { player, playerNames } from "@modules/state/base/stores"
  import { gameConfig } from "@modules/state/base/stores"
  import { availableOrders } from "@modules/state/base/stores"
  import { tutorialProgress } from "@modules/ui/assistant"
  import { playSound } from "@modules/sound"
  // import { mod } from "@modules/utils"
  import OrderItem from "./OrderItem.svelte"
  import Countdown from "./Countdown.svelte"

  let element: HTMLDivElement

  let selected = -1
  let certified = true

  const localOrders = Object.entries($availableOrders)

  const orderFilter = (entry: [string, Order]) => {
    const order = entry[1]
    if (certified) {
      return order.order.creator === $gameConfig.adminAddress
    } else {
      return order.order.creator !== $gameConfig.adminAddress // add auto expiry after 6hr
    }
  }

  const orderSort = (a, b) => {
    // Convert the dates to Date objects for comparison
    const dateA = Number(a[1].order.creationBlock)
    const dateB = Number(b[1].order.creationBlock)

    // Compare the dates
    if (dateA < dateB) return -1
    if (dateA > dateB) return 1

    const hasCompleted = (address: string) =>
      $player.completedOrders?.includes(address) || false
    const isExhausted = (order: Order) =>
      order.order.maxPlayers > 0 &&
      (order.completedPlayers ?? 0) >= order.order.maxPlayers

    const getStatus = (entry: [string, Order]) => {
      if (isExhausted(entry[1])) return 2
      if (hasCompleted(entry[0])) return 1
      return 0
    }

    return getStatus(a) - getStatus(b)
  }

  let currentOrders = [...localOrders].filter(orderFilter).sort(orderSort)

  $: {
    if (certified) {
      currentOrders = [...localOrders].filter(orderFilter).sort(orderSort)
    } else {
      currentOrders = [...localOrders].filter(orderFilter).sort(orderSort)
    }
  }

  const cycle = (e: KeyboardEvent) => {
    const options = Object.keys($availableOrders).length
    if (e.key === "ArrowDown") {
      selected = mod(selected + 1, options)
      playSound("tcm", "orderSelect")
    } else if (e.key === "ArrowUp") {
      selected = mod(selected - 1, options)
      playSound("tcm", "orderSelect")
    }

    if (e.key === "ArrowRight") {
      certified = false
    }
    if (e.key === "ArrowLeft") {
      certified = true
    }

    if (element?.parentElement) {
      element.parentElement.scrollTop = 0
      element.parentElement.scrollTop = selected * 250
    }
  }

  const now = new Date()
  const tomorrow = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    16
  ) // Subtract 2 to convert from CEST (UTC+2) to UTC

  const goTo = (i: number) => {
    selected = i
    playSound("tcm", "orderSelect")
  }
</script>

<svelte:window on:keydown|stopPropagation={cycle} />

{#if $tutorialProgress > 4}
  <div class="head">
    <div class="order-count">
      {currentOrders.length} Order{#if Object.keys($availableOrders).length !== 1}s{/if}
    </div>
    {#if !$player.tutorial}
      <Countdown endTime={tomorrow} />
    {/if}
    <span class="warn">“Accept, ship, repeat”</span>
  </div>

  <div class="tabs">
    {#if !$player.tutorial}
      <div
        role="button"
        on:click={() => (certified = true)}
        class="tab"
        class:active={certified}
      >
        TCM APPROVED ORDERS
      </div>
      <div
        role="button"
        on:click={() => (certified = false)}
        class="tab rogue"
        class:active={!certified}
      >
        XXX ROGUE XXX ORDERS XXX
      </div>
    {/if}
  </div>

  <div bind:this={element} class="container">
    <div class="order-list">
      {#key certified}
        {#if currentOrders.length > 0}
          {#each currentOrders as [key, order], i (key)}
            <OrderItem
              on:scroll={() => goTo(i)}
              on:mouseenter={() => goTo(i)}
              selected={selected === i}
              {key}
              {order}
              active={$player.currentOrder === key}
              completed={$player.completedOrders?.includes(key) || false}
              rogue={!certified}
            />
          {/each}
        {:else}
          <div class="orders-exhausted">
            <div class="warn blink">ALL ORDERS EXHAUSTED</div>
          </div>
        {/if}
      {/key}
    </div>
  </div>
{/if}

<style lang="scss">
  .container {
    padding: var(--default-padding);
    padding-top: 1rem;
    padding-bottom: 0;
    position: relative;
    height: calc(100% - 3rem);

    .order-list {
      height: 100%;
      display: block;

      .orders-exhausted {
        height: 100%;
        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
        align-items: center;
      }
    }

    .warn {
      width: 100%;
      display: block;
      font-size: var(--font-size-small);
      color: var(--color-failure);
      text-align: center;
    }
  }

  .head {
    padding: var(--default-padding);
  }

  .tabs,
  .head {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: flex-end;
    position: sticky;
    width: 100%;
    overflow: hidden;
    background-color: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(5px);
    z-index: var(--z-1);
    top: 0;
    left: 0;
    font-size: var(--font-size-small);
    border-bottom: 1px solid var(--color-grey-dark);

    .warn {
      text-align: right;
      font-size: var(--font-size-small);
      color: var(--color-failure);
    }

    .tab {
      background: var(--color-grey-mid);
      font-family: var(--font-family);
      font-size: var(--font-size-small);
      border: none;
      opacity: 0.5;
      user-select: none;
      text-align: center;
      padding: var(--default-padding);
      width: 50%;
      white-space: nowrap;
      cursor: pointer;
      overflow: hidden;
      border: 1px solid var(--color-grey-mid);

      &.rogue {
        color: var(--color-grey-dark);

        &.active {
          background: var(--color-tutorial);
          border: 1px solid var(--color-tutorial);
        }
      }

      &.active {
        opacity: 1;
        border: 1px solid var(--color-success);
      }
    }
  }
</style>
