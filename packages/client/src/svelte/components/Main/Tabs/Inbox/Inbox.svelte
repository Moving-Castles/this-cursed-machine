<script lang="ts">
  import { staticContent } from "@modules/content"
  import { player } from "@modules/state/base/stores"
  import { fade } from "svelte/transition"
  import { playSound } from "@modules/sound"
  import { mod } from "@modules/utils"
  import InboxItem from "./InboxItem.svelte"
  import { discoveredMessages } from "@modules/state/simulated/stores"

  let selected = 0
  let openItem = -1

  let element: HTMLDivElement

  $: messages = $staticContent.messages.filter(msg => {
    if ($player.tutorial) {
      return $player.tutorial && msg.tutorial
    } else {
      return (
        msg.tutorial || msg.graduation || $discoveredMessages.includes(msg._id)
      )
    }
  })

  const cycle = (e: KeyboardEvent) => {
    if (openItem < 0) {
      if (e.key === "ArrowDown") {
        selected = mod(selected + 1, messages.length)
        playSound("tcm", "selectionScroll")
      } else if (e.key === "ArrowUp") {
        selected = mod(selected - 1, messages.length)
        playSound("tcm", "selectionScroll")
      }

      if (e.key === "Enter") {
        openItem = selected
        playSound("tcm", "selectionScroll")
      }

      if (e.key === "Escape") {
        openItem = -1
      }

      if (element?.parentElement) {
        element.parentElement.scrollTop = selected * 250
      }
    }
  }
</script>

<svelte:window on:keydown|stopPropagation={cycle} />

<div class="head">
  <div>{messages?.length ?? 0} messages</div>
  <span class="warn">
    Violations of the TCM Titanium Grade NDA™ will be punished
  </span>
</div>

<div class="inbox" in:fade bind:this={element}>
  {#each messages as message, i}
    <InboxItem
      on:click={() => (openItem = openItem === i ? -1 : i)}
      on:close={() => (openItem = -1)}
      on:open={() => {
        selected = -1
        openItem = i
      }}
      {message}
      selected={selected === i}
      open={openItem === i}
    />
  {/each}
</div>

<style lang="scss">
  .head {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: flex-end;
    width: 100%;
    overflow: hidden;
    background-color: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(5px);
    z-index: var(--z-1);
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

  .inbox {
    padding-inline: var(--default-padding);
    margin-top: 4rem;
    height: calc(100vh - 200px);
    overflow-y: hidden;
  }
</style>
