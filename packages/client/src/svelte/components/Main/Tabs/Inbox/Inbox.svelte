<script lang="ts">
  import { staticContent } from "@modules/content"
  import { player } from "@modules/state/base/stores"
  import { fade } from "svelte/transition"
  import InboxItem from "./InboxItem.svelte"

  $: messages = $staticContent.messages.filter(msg => {
    if ($player.tutorial) {
      return $player.tutorial && msg.tutorial
    } else {
      return msg
    }
  })
</script>

<div class="head">
  <div>{messages?.length ?? 0} messages</div>
  <span class="warn">
    Violations of the TCM Premium Titanum NDA™ will be punished
  </span>
</div>

<div class="inbox" in:fade>
  {#each messages as message}
    <InboxItem {message} />
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
    padding-top: 3rem;
  }
</style>
