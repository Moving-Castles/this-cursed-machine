<script lang="ts">
  import { onMount, createEventDispatcher } from "svelte"
  import { sendChatMessage } from "@modules/signal"
  import type { ChatMessage } from "@modules/signal/types"
  import { player, playerAddress } from "@modules/state/base/stores"
  import { v4 as uuid } from "uuid"
  import { walletNetwork } from "@modules/network"
  import { notificationPermissions } from "@modules/ui/stores"
  import { playSound } from "@modules/sound"
  import TerminalInput from "../../Terminal/TerminalInput.svelte"

  export let inputElement: HTMLInputElement

  const dispatch = createEventDispatcher()

  let message = ""

  const sendNotification = msg => {
    const notification = new Notification("New message", {
      body: `${$player.name}: ${msg.message}`,
      icon: "/images/tcm2.png",
    })
    console.log(notification)
  }

  function sendMessage() {
    dispatch("send")

    if (message === "") return
    const newMessage: ChatMessage = {
      id: uuid(),
      world: $walletNetwork.worldContract.address,
      message,
      timestamp: Date.now(),
      address: $playerAddress,
    }
    sendChatMessage(newMessage)
    // if ($notificationPermissions === "granted") {
    // }
    // sendNotification(newMessage)
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
