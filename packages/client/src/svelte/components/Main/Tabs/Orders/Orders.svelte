<script lang="ts">
  import { player } from "@modules/state/base/stores"
  import { availableOrders } from "@modules/state/base/stores"
  import { tutorialProgress } from "@modules/ui/assistant"
  import { playSound } from "@modules/sound"
  import OrderItem from "./OrderItem.svelte"

  function mod(n, m) {
    return ((n % m) + m) % m
  }

  let element

  let selected = -1

  const cycle = e => {
    e.stopPropagation()
    const options = Object.keys($availableOrders).length
    if (e.key === "ArrowDown") {
      selected = mod(selected + 1, options)
      playSound("tcm", "selectionScroll")
    } else if (e.key === "ArrowUp") {
      selected = mod(selected - 1, options)
      playSound("tcm", "selectionScroll")
    }

    element.parentElement.scrollTop = selected * 250
  }

  const goTo = i => {
    selected = i
    playSound("tcm", "selectionScroll")
  }
</script>

<svelte:window on:keydown|stopPropagation={cycle} />

{#if $tutorialProgress > 4}
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
          completed={$player.completed?.includes(key)}
        />
      {/each}
    </div>
  </div>
{/if}

<style lang="scss">
  .container {
    padding: 20px;
  }
</style>
