<script lang="ts">
  import { player } from "@modules/state/base/stores"
  import { blockNumber } from "@modules/network"
  import { gameConfig } from "@modules/state/base/stores"
  import { availableOrders } from "@modules/state/base/stores"
  import { tutorialProgress } from "@modules/ui/assistant"
  import { playSound } from "@modules/sound"
  import { mod } from "@modules/utils"
  import OrderItem from "./OrderItem.svelte"
  // import Countdown from "./Countdown.svelte"

  let element: HTMLDivElement

  let selected = -1
  $: certified = $player.tutorial ? true : false

  const localOrders = Object.entries($availableOrders)

  const USER_ORDERS_FILTER_PERIOD = BigInt(1800) // Number of blocks in one hour at 2 second blocktime

  const hasCompleted = (address: string) =>
    $player.completedOrders?.includes(address) || false

  const isExhausted = (order: Order) =>
    order.order.maxPlayers > 0 &&
    (order.completedPlayers ?? 0) >= order.order.maxPlayers

  const orderFilter = (entry: [string, Order]) => {
    const key = entry[0]
    const order = entry[1]
    if (certified) {
      return order.order.creator === $gameConfig.adminAddress
    } else {
      // Filter out certified orders
      if (order.order.creator === $gameConfig.adminAddress) return false

      // Filter out orders that are exhausted or completed and more than 1 hour old
      if (
        (isExhausted(order) || hasCompleted(key)) &&
        $blockNumber > order.order.creationBlock + USER_ORDERS_FILTER_PERIOD
      ) {
        return false
      }

      // Otherwise include the order
      return true
    }
  }

  const orderSort = (a: [string, Order], b: [string, Order]) => {
    // Convert the dates to Date objects for comparison
    const dateA = Number(a[1].order.creationBlock)
    const dateB = Number(b[1].order.creationBlock)

    // Compare the dates
    if (dateA > dateB) return -1
    if (dateA < dateB) return 1

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
      playSound("tcm", "listPrint")
    } else if (e.key === "ArrowUp") {
      selected = mod(selected - 1, options)
      playSound("tcm", "listPrint")
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

  const goTo = (i: number) => {
    selected = i
    playSound("tcm", "listPrint")
  }

  const toggleCertified = () => {
    certified = !certified
    playSound("tcm", "selectionEnter")
  }
</script>

<svelte:window on:keydown|stopPropagation={cycle} />

{#if $tutorialProgress > 4}
  <div class="head">
    <div class="order-count">
      {currentOrders.length} Order{#if Object.keys($availableOrders).length !== 1}s{/if}
    </div>
    <span class="warn">“Accept, ship, repeat”</span>
  </div>

  {#if !$player.tutorial}
    <div class="tabs">
      <!-- svelte-ignore a11y-interactive-supports-focus -->
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div
        role="button"
        on:click={toggleCertified}
        class="tab rogue"
        class:active={!certified}
      >
        <span class="warning">XXX</span> ROGUE ORDERS
        <span class="warning">XXX</span>
      </div>
      <!-- svelte-ignore a11y-interactive-supports-focus -->
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div
        role="button"
        on:click={toggleCertified}
        class="tab"
        class:active={certified}
      >
        TCM APPROVED ORDERS
      </div>
    </div>
  {/if}

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
            {#if certified}
              <div class="warn blink">
                Q1 FINISHED. TCM CERTIFIED ORDERS SUSPENDED.
              </div>
            {:else}
              <div class="warn blink">ALL ORDERS EXHAUSTED</div>
            {/if}
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
      font-family: var(--font-family);
      font-size: var(--font-size-small);
      border: none;
      user-select: none;
      text-align: center;
      padding: var(--default-padding);
      width: 50%;
      white-space: nowrap;
      cursor: pointer;
      overflow: hidden;
      border: 1px solid var(--color-grey-mid);
      background: var(--color-grey-dark);

      &.active {
        background: var(--color-grey-mid);

        border: 1px solid var(--color-success);
      }

      &:hover {
        background: var(--color-grey-mid);
      }
    }
  }

  .warning {
    background: var(--color-failure);
    color: var(--background);
  }
</style>
