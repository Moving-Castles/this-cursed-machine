<script lang="ts">
  import { onMount, createEventDispatcher } from "svelte"
  import { sendChatMessage } from "@modules/signal"
  import type { ChatMessage } from "@modules/signal/types"
  import { playerAddress } from "@modules/state/base/stores"
  import { v4 as uuid } from "uuid"
  import { network } from "@modules/network"
  import { playSound } from "@modules/sound"
  import TerminalInput from "../../Terminal/TerminalInput.svelte"

  export let inputElement: HTMLInputElement

  const dispatch = createEventDispatcher()

  let message = ""

  function sendMessage() {
    dispatch("send")

    if (message === "") return
    const newMessage: ChatMessage = {
      id: uuid(),
      world: $network.worldContract.address,
      message,
      timestamp: Date.now(),
      address: $playerAddress,
    }
    sendChatMessage(newMessage)
    playSound("tcm", "TRX_yes")
    message = ""
  }

  onMount(() => {
    inputElement?.focus()
  })
</script>

<TerminalInput
  onSubmit={sendMessage}
  bind:value={message}
  bind:inputElement
  placeholder="message"
/>
