<script lang="ts">
  import { verifiedClients } from "@modules/signal/stores"
  import type { ChatMessage } from "@modules/signal/types"
  export let message: ChatMessage

  $: console.log("$verifiedClients", $verifiedClients)
</script>

<div class="message">
  <div class="message-header">
    <div class="message-author">
      {#if $verifiedClients.includes(message.address.toLowerCase())}
        <span class="verified">✅</span>
      {/if}
      {message.name}
    </div>
    <div class="message-timestamp">{message.timestamp}</div>
  </div>
  <div class="message-content">{message.message}</div>
</div>

<style lang="scss">
  .message {
    padding: 10px;
    border-bottom: 1px solid #ccc;
  }

  .message-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .message-author {
    font-weight: bold;
  }

  .verified {
    margin-right: 5px;
  }

  .message-timestamp {
    font-size: 0.8em;
    color: #666;
  }

  .message-content {
    margin-top: 5px;
  }
</style>
