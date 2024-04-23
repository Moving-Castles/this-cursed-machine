<script lang="ts">
  import { player } from "@modules/state/base/stores"
  import { availableOrders } from "@modules/state/base/stores"
  import { tutorialProgress } from "@modules/ui/assistant"
  import { playSound } from "@modules/sound"
  import { mod } from "@modules/utils"
  import OrderItem from "./OrderItem.svelte"

  let element: HTMLDivElement

  let selected = -1

  const cycle = (e: KeyboardEvent) => {
    const options = Object.keys($availableOrders).length
    if (e.key === "ArrowDown") {
      selected = mod(selected + 1, options)
      playSound("tcm", "selectionScroll")
    } else if (e.key === "ArrowUp") {
      selected = mod(selected - 1, options)
      playSound("tcm", "selectionScroll")
    }

    if (element?.parentElement) {
      element.parentElement.scrollTop = selected * 250
    }
  }

  const goTo = (i: number) => {
    selected = i
    playSound("tcm", "selectionScroll")
  }
</script>

<svelte:window on:keydown|stopPropagation={cycle} />

{#if $tutorialProgress > 4}
  <div class="head">
    <div>
      {Object.keys($availableOrders).length} Order{#if Object.keys($availableOrders).length !== 1}s{/if}
    </div>
    <span class="warn">“Accept, ship, repeat”</span>
  </div>

  <div bind:this={element} class="container">
    <div class="order-list">
      {#each Object.entries($availableOrders) as [key, order], i (key)}
        <OrderItem
          on:scroll={() => goTo(i)}
          on:mouseenter={() => goTo(i)}
          selected={selected === i}
          {key}
          {order}
          active={$player.currentOrder === key}
          completed={$player.completed?.includes(key) || false}
        />
      {/each}
    </div>
  </div>
{/if}

<style lang="scss">
  .container {
    padding: var(--default-padding);
    padding-top: 4rem;
    position: relative;
  }

  .head {
    padding: var(--default-padding);
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: flex-end;
    position: absolute;
    width: 100%;
    overflow: hidden;
    background-color: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(5px);
    z-index: var(--z-1);

    top: 0;
    left: 0;
    padding: 2em;
    padding-inline: var(--default-padding);
    padding-bottom: 1em;
    font-size: var(--font-size-small);
    border-bottom: 1px solid var(--color-grey-dark);

    .warn {
      text-align: right;
      font-size: var(--font-size-small);
      color: var(--color-failure);
    }
  }
</style>
