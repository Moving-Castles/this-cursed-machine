<script lang="ts">
  import { sendChatMessage } from "@modules/signal"
  import type { ChatMessage } from "@modules/signal/types"
  import { player, playerAddress } from "@modules/state/base/stores"
  import { v4 as uuid } from "uuid"

  let message = "TEST"

  function sendMessage() {
    const newMessage: ChatMessage = {
      id: uuid(),
      name: $player.name ?? "Unknown",
      message,
      timestamp: Date.now(),
      address: $playerAddress,
    }
    sendChatMessage(newMessage)
    message = "TESTss"
  }
</script>

<div>
  <input type="text" bind:value={message} />
  <button on:click={sendMessage}>Send</button>
</div>

<style lang="scss">
  .container {
    padding: 20px;
  }
</style>
