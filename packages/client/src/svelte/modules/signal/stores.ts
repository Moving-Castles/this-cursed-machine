import { writable } from "svelte/store"
import { ChatMessage } from "./types"

export let verifiedClients = writable([] as string[])
export let chatMessages = writable([] as ChatMessage[])