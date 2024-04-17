<script lang="ts">
  import { fade } from "svelte/transition"
  import { chatMessages, verifiedClients } from "@modules/signal/stores"
  import ChatMessageItem from "./ChatMessageItem.svelte"
  import ChatInput from "./ChatInput.svelte"
</script>

<div class="container" in:fade>
  <div>CHAT ({$verifiedClients.length})</div>
  <div class="message-container">
    {#each $chatMessages as message}
      <ChatMessageItem {message} />
    {/each}
  </div>
  <div class="input-container">
    <ChatInput />
  </div>
</div>

<style lang="scss">
  .container {
    padding: 20px;

    .message-container {
      height: 400px;
      overflow-y: auto;
    }
  }
</style>
