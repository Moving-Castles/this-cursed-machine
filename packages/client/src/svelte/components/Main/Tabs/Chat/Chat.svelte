<script lang="ts">
  import { fade } from "svelte/transition"
  import { chatMessages, verifiedClients } from "@modules/signal/stores"
  import ChatMessageItem from "./ChatMessageItem.svelte"
  import ChatInput from "./ChatInput.svelte"
  import { onMount } from "svelte"

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
    polling = true
    await new Promise(r => setTimeout(r, 100))
    messagesContainer.scrollTo(0, messagesContainer.scrollHeight)
    await new Promise(r => setTimeout(r, 100))
    if ($chatMessages[$chatMessages.length - 1]) {
      lastChecked = $chatMessages[$chatMessages.length - 1].timestamp
    }
    polling = false
  }

  onMount(scrollBottom)
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  bind:clientHeight
  bind:clientWidth
  on:click={() => inputElement?.focus()}
  class="outer"
>
  <div class="head">
    <div>
      {$verifiedClients.length} Stump{#if $verifiedClients.length !== 1}s{/if}
      online
    </div>
    <span class="warn">
      Violations of the TCM Limited free speech policy will be punished
    </span>
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
      <!-- svelte-ignore a11y-no-static-element-interactions -->
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
    padding-inline: var(--default-padding);
    padding-top: 3rem;
    padding-bottom: 4rem;
    overflow-y: scroll;
    scroll-behavior: smooth;
    max-width: 1200px;
    margin-right: auto;
    margin-left: auto;

    .message-container {
      overflow-y: scroll;
      margin-bottom: 0rem;
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
      color: var(--color-failure);
    }
  }

  .head {
    top: 0;
    padding: 2em;
    padding-inline: var(--default-padding);
    padding-bottom: 1em;
    font-size: var(--font-size-small);
    border-bottom: 1px solid var(--color-grey-dark);
  }

  .foot {
    height: 3rem;
    bottom: 0;

    border-top: 1px solid var(--color-grey-dark);

    .catch-up {
      background: var(--color-scuccess);
      color: var(--background);
      padding: 2px;
      position: absolute;
      right: 1rem;
      bottom: 1rem;
      cursor: pointer;
    }
  }
</style>
