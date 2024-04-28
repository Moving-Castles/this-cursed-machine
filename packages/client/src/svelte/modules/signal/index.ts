import { get } from "svelte/store"
import { walletNetwork } from "../network"
import { getUniqueValues } from "../utils"
import type { ChatMessage, Client, MessageObject } from "./types"
import { SIGNAL_SERVER_URL, MESSAGE } from "./constants"
import { chatMessages, verifiedClients } from "./stores"

let socket: WebSocket

export function initSignalNetwork() {
    socket = new WebSocket(SIGNAL_SERVER_URL)

    // Connection opened, verify address
    socket.addEventListener("open", sendVerification)

    // Listen for messages
    socket.addEventListener("message", (event: { data: string }) => {
        // console.log("Message from server ", event.data)
        let msgObj: MessageObject = JSON.parse(event.data)

        // VERIFIED CLIENTS
        if (msgObj.topic === "verifiedClients") {
            // TODO: do this on server ??
            // Verified clients changed: dedupe and filter to players in current world
            verifiedClients.update((verifiedClients) => {
                verifiedClients = getUniqueValues(
                    msgObj.verifiedClients
                        // .filter((client: Client) => get(players)[addressToId(client.address)])
                        .map((client: Client) => client.address))

                return verifiedClients;
            })
        }

        // Chat
        if (msgObj.topic === "chat") {
            chatMessages.update(messages => {
                // Abort if the message is not for the current world
                if (msgObj.data.world !== get(walletNetwork).worldContract.address) return messages
                messages.push(msgObj.data)
                return messages
            })
        }
    })
}

async function sendVerification() {
    const signature = await get(walletNetwork).walletClient.signMessage({ message: MESSAGE });
    const message = JSON.stringify({
        topic: "verify",
        data: { signature: signature },
    })
    socket.send(message)
}

export async function sendChatMessage(chatMessage: ChatMessage) {
    const message = JSON.stringify({
        topic: "chat",
        data: chatMessage,
    })
    socket.send(message)
}