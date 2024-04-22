<script lang="ts">
  import { fade } from "svelte/transition"
  import { players, playerAddress } from "@svelte/modules/state/base/stores"
  import { addressToId, timeSince } from "@modules/utils"
  import type { ChatMessage } from "@modules/signal/types"
  export let message: ChatMessage

  let warning = false

  if (
    message.message ===
    "MESSAGE IN VIOLATION OF TCM LIMITED FREE SPEECH POLICY. TACTICAL SUPPORT TEAM HAS BEEN ALERTED."
  ) {
    warning = true
  }
</script>

<div class="message" in:fade>
  <div class="message-header">
    <div class="message-author">
      <span class="author-name" class:self={message.address === $playerAddress}>
        {$players[addressToId(message.address)]?.name || "unknown"}
      </span>
    </div>
    <div class="message-timestamp">{timeSince(message.timestamp)}</div>
  </div>
  <div class="message-content">
    <span class:warning>{message.message}</span>
  </div>
</div>

<style lang="scss">
  .message {
    padding: 10px 0;
    border-bottom: 1px solid var(--color-grey-light);
    line-height: 1.2em;
  }

  .warning {
    background: var(--color-failure);
    color: var(--background);
    padding: 2px;
  }

  .message-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .message-author {
    .author-name {
      background: var(--foreground);
      color: var(--background);
      padding: 2px;

      &.self {
        background: var(--color-success);
      }
    }
  }

  .verified {
    margin-right: 5px;
  }

  .message-timestamp {
    font-size: 0.8em;
    color: var(--color-grey-light);
    font-size: var(--font-size-small);
  }

  .message-content {
    margin-top: 5px;
  }
</style>
