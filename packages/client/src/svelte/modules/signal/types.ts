export type Client = {
    id: string
    address: string
}

export type ChatMessage = {
    id: string
    timestamp: number
    address: string
    name: string
    message: string
}

export type MessageObject = {
    topic: "broadcast" | "chat" | "verifiedClients",
    data: ChatMessage,
    verifiedClients: Client[]
}