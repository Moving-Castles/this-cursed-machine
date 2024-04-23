export type Client = {
    id: string
    address: string
}

export type ChatMessage = {
    id: string
    world: string
    timestamp: number
    address: string
    message: string
}

export type MessageObject = {
    topic: "broadcast" | "chat" | "verifiedClients",
    data: ChatMessage,
    verifiedClients: Client[]
}