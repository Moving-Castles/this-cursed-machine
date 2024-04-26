import { chainConfig } from "viem/op-stack";
import { mainnet } from "viem/chains";

export const redstone = {
    ...chainConfig,
    id: 690,
    sourceId: mainnet.id,
    name: "Redstone",
    network: "redstone",
    summary: {
        location: "Ethereum mainnet",
    },
    description: "Redstone",
    nativeCurrency: {
        decimals: 18,
        name: "Holesky Ether",
        symbol: "ETH",
    },
    rpcUrls: {
        default: {
            http: ["https://rpc.redstonechain.com"],
            webSocket: ["wss://rpc.redstonechain.com"],
        }
    },
    blockExplorers: {
        default: {
            name: "Blockscout",
            url: "https://explorer.redstone.xyz/",
        },
    },
};