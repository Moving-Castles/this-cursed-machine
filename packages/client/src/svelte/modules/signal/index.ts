import { get, writable } from "svelte/store"
import { network } from "../network"
import { cores } from "../state"
import { getUniqueValues } from "../../utils/misc"
import { padAddress } from "../../utils/misc"

// --- TYPES -------------------------------------------------------------------

type Client = {
    id: string
    address: string
}

// --- CONSTANTS --------------------------------------------------------------

const SIGNAL_SERVER_URL = "wss://mc.rttskr.com"
const MESSAGE = "mc"

// --- STORES -----------------------------------------------------------------

export let verifiedClients = writable([] as string[])
export let cursors = writable({} as { [key: string]: { x: number; y: number } })
export let cheering = writable(false)

let socket: any

export function initSignalNetwork() {
    socket = new WebSocket(SIGNAL_SERVER_URL)

    // Connection opened, verify address
    socket.addEventListener("open", sendVerification)

    // Listen for messages
    socket.addEventListener("message", (event: { data: string }) => {
        // console.log("Message from server ", event.data)
        let msgObj = JSON.parse(event.data)

        // VERIFIED CLIENTS
        if (msgObj.topic === "verifiedClients") {

            // TODO: do this on server ??
            // Verified clients changed: dedupe and filter to cores in current world
            verifiedClients.update((verifiedClients) => {

                verifiedClients = getUniqueValues(
                    msgObj.verifiedClients
                        .filter((client: Client) => get(cores)[padAddress(client.address)])
                        .map((client: Client) => padAddress(client.address)))

                return verifiedClients;
            })
        }
    })
}

async function sendVerification() {
    const signature = await get(network).network.signer.value_.signMessage(MESSAGE)
    const message = JSON.stringify({
        topic: "verify",
        data: { signature: signature },
    })
    socket.send(message)
}