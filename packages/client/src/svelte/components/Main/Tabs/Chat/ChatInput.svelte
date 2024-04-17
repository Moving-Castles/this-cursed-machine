<script lang="ts">
  import { sendChatMessage } from "@modules/signal"
  import type { ChatMessage } from "@modules/signal/types"
  import { player, playerAddress } from "@modules/state/base/stores"
  import { v4 as uuid } from "uuid"
  import { network } from "@modules/network"

  let message = ""

  function sendMessage() {
    const newMessage: ChatMessage = {
      id: uuid(),
      name: $player.name ?? "Unknown",
      world: $network.worldContract.address,
      message,
      timestamp: Date.now(),
      address: $playerAddress,
    }
    sendChatMessage(newMessage)
    message = "TESTss"
  }
</script>

<div>
  <input type="text" placeholder="message" bind:value={message} />
  <button on:click={sendMessage}>Send</button>
</div>

<style lang="scss">
  .container {
    padding: 20px;
  }
</style>
