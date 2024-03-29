<script lang="ts">
  import { sendChatMessage } from "@modules/signal"
  import type { ChatMessage } from "@modules/signal/types"
  import { player, playerAddress } from "@modules/state/base/stores"
  import { v4 as uuid } from "uuid"

  let message = "I DON’T HAVE BRAIN DAMAGE!! <3<3<3"

  function sendMessage() {
    const newMessage: ChatMessage = {
      id: uuid(),
      name: $player.name ?? "Unknown",
      message,
      timestamp: Date.now(),
      address: $playerAddress,
    }
    sendChatMessage(newMessage)
  }
</script>

<div>
  <button on:click={sendMessage}>{message}</button>
</div>

<style lang="scss">
  button {
    padding: 30px;
  }
</style>
