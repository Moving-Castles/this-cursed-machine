<script lang="ts">
  import { tick } from "svelte"
  import { fade } from "svelte/transition"
  import { chatMessages, verifiedClients } from "@modules/signal/stores"
  import ChatMessageItem from "./ChatMessageItem.svelte"
  import ChatInput from "./ChatInput.svelte"

  let clientHeight = 0
  let clientWidth = 0
  let messagesContainer: HTMLElement
  let messagesContainerHeight = 0
  let inputElement: HTMLInputElement
  let lastChecked =
    $chatMessages.length > 0 &&
    $chatMessages[$chatMessages.length - 1].timestamp
  let polling = false

  $: unreadMessages = $chatMessages.filter(msg => msg.timestamp > lastChecked)

  const scrollBottom = async () => {
    // console.log(messagesContainer.scrollHeight)
    await tick()
    await tick()
    await tick()
    messagesContainer.scrollTo(0, messagesContainer.scrollHeight)
    polling = true
    setTimeout(() => {
      lastChecked = $chatMessages[$chatMessages.length - 1].timestamp
      polling = false
    }, 100)
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  bind:clientHeight
  bind:clientWidth
  on:click={() => inputElement?.focus()}
  class="outer"
>
  <div class="head">
    <div>
      ({$verifiedClients.length}) Stump{#if $verifiedClients.length !== 1}s{/if}
      online
    </div>
    <p class="warn">
      Violations of the TCM Limited free speech policy will be punished
    </p>
  </div>
  <div
    bind:this={messagesContainer}
    class="container"
    style:height="{clientHeight}px"
    in:fade
  >
    <div bind:clientHeight={messagesContainerHeight} class="message-container">
      {#each $chatMessages as message, i (`${message.timestamp}-${i}`)}
        <ChatMessageItem {message} />
      {/each}
    </div>
  </div>
  <div style:width="{clientWidth}px" class="foot">
    <div class="input-container">
      <ChatInput on:send={scrollBottom} bind:inputElement />
    </div>

    {#if unreadMessages.length > 0 && !polling && messagesContainerHeight > messagesContainer.clientHeight}
      <div on:click={scrollBottom} class="catch-up">
        {unreadMessages.length} UNREAD
      </div>
    {/if}
  </div>
</div>

<style lang="scss">
  .outer {
    height: 100%;
    width: 100%;
    overflow: hidden;
  }
  .container {
    padding: 4rem var(--default-padding);
    overflow-y: scroll;
    scroll-behavior: smooth;

    .message-container {
      overflow-y: scroll;
      margin-bottom: 4rem;
    }
  }

  .foot,
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

    .warn {
      text-align: right;
      font-size: var(--font-size-small);
    }
  }

  .head {
    top: 0;
    height: 5rem;
  }

  .foot {
    height: 3rem;
    bottom: 0;

    .catch-up {
      color: var(--color-failure);
      position: absolute;
      right: 1rem;
      bottom: 1rem;
    }
  }
</style>
